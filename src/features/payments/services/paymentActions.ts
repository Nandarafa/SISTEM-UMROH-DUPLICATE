"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function createMassBillingAction(formData: FormData) {
  try {
    const packageId = formData.get("package_id") as string;
    const dpInput = formData.get("dp_amount") as string;
    const installmentsInput = formData.get("installments_count") as string;
    const firstDueDateInput = formData.get("first_due_date") as string;

    if (!packageId) {
      return { error: "Pilih paket terlebih dahulu." };
    }

    const installmentsCount = parseInt(installmentsInput || "3", 10);
    if (isNaN(installmentsCount) || installmentsCount < 1) {
      return { error: "Jumlah cicilan minimal 1." };
    }

    const dpAmount = dpInput ? parseFloat(dpInput.replace(/[^0-9]/g, "")) || 0 : 0;
    const firstDueDate = firstDueDateInput ? new Date(firstDueDateInput) : new Date();

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) {
      return { success: true };
    }

    // 1. Get package info
    const { data: pkg } = await supabase
      .from("packages")
      .select("id, name, price, down_payment")
      .eq("id", packageId)
      .single();

    if (!pkg) {
      return { error: "Paket tidak ditemukan." };
    }

    // 2. Find active registrations for this package
    const { data: registrations } = await supabase
      .from("registrations")
      .select("id, branch_id, code, total_price, pilgrim_id")
      .eq("package_id", packageId);

    if (!registrations || registrations.length === 0) {
      return { error: "Tidak ada pendaftaran aktif untuk paket ini." };
    }

    // 3. For each registration, check if it already has payments
    for (const reg of registrations) {
      const { data: existingPayments } = await supabase
        .from("payments")
        .select("id")
        .eq("registration_id", reg.id);

      if (existingPayments && existingPayments.length > 0) {
        // Skip registrations that already have billing records
        continue;
      }

      const totalPrice = Number(reg.total_price || pkg.price || 0);
      const effectiveDp = dpAmount > 0 ? dpAmount : Number(pkg.down_payment || 0);
      const remainingForInstallments = Math.max(0, totalPrice - effectiveDp);
      const installmentAmount = Math.round(remainingForInstallments / installmentsCount);

      const paymentsToInsert: any[] = [];

      // DP record if DP > 0
      if (effectiveDp > 0) {
        paymentsToInsert.push({
          branch_id: reg.branch_id || "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          registration_id: reg.id,
          code: `${reg.code}-DP`,
          type: "dp",
          amount: effectiveDp,
          paid_amount: 0,
          status: "unpaid",
          due_date: firstDueDate.toISOString().split("T")[0],
        });
      }

      // Installment records
      for (let i = 1; i <= installmentsCount; i++) {
        const dueDate = new Date(firstDueDate);
        dueDate.setMonth(dueDate.getMonth() + (effectiveDp > 0 ? i : i - 1));

        // Adjust last installment to cover rounding
        const currentAmount =
          i === installmentsCount
            ? remainingForInstallments - installmentAmount * (installmentsCount - 1)
            : installmentAmount;

        paymentsToInsert.push({
          branch_id: reg.branch_id || "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          registration_id: reg.id,
          code: `${reg.code}-C${i}`,
          type: "installment",
          amount: Math.max(0, currentAmount),
          paid_amount: 0,
          status: "unpaid",
          due_date: dueDate.toISOString().split("T")[0],
        });
      }

      if (paymentsToInsert.length > 0) {
        await supabase.from("payments").insert(paymentsToInsert);
      }
    }

    revalidatePath("/payments");
    return { success: true };
  } catch (err: any) {
    console.error("Error in createMassBillingAction:", err);
    return { error: err.message || "Gagal membuat tagihan massal." };
  }
}

export async function recordPaymentAction(formData: FormData) {
  try {
    const paymentId = formData.get("payment_id") as string;
    const amountStr = formData.get("amount") as string;
    const method = (formData.get("method") as string) || "transfer";
    const note = (formData.get("note") as string) || "";

    if (!paymentId) {
      return { error: "ID tagihan pembayaran tidak ditemukan." };
    }

    const payAmount = parseFloat(amountStr?.replace(/[^0-9.]/g, "") || "0");
    if (isNaN(payAmount) || payAmount <= 0) {
      return { error: "Jumlah pembayaran harus lebih dari 0." };
    }

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    // 1. Fetch payment
    const { data: payment, error: pError } = await supabase
      .from("payments")
      .select("*, registrations(*)")
      .eq("id", paymentId)
      .single();

    if (pError || !payment) {
      return { error: "Data tagihan tidak ditemukan." };
    }

    const currentPaid = Number(payment.paid_amount || 0);
    const targetAmount = Number(payment.amount || 0);
    const newPaidAmount = Math.min(targetAmount, currentPaid + payAmount);
    const newStatus = newPaidAmount >= targetAmount ? "paid" : "partial";

    // 2. Update payment
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        paid_amount: newPaidAmount,
        status: newStatus,
      })
      .eq("id", paymentId);

    if (updateError) {
      return { error: "Gagal memperbarui pembayaran: " + updateError.message };
    }

    // 3. Update registration if all paid or total paid matches
    if (payment.registration_id) {
      const { data: allRegPayments } = await supabase
        .from("payments")
        .select("amount, paid_amount")
        .eq("registration_id", payment.registration_id);

      if (allRegPayments) {
        const totalPaid = allRegPayments.reduce(
          (acc: number, p: any) => acc + Number(p.paid_amount || 0),
          0
        );
        const { data: regData } = await supabase
          .from("registrations")
          .select("total_price, status")
          .eq("id", payment.registration_id)
          .single();

        if (regData) {
          const totalPrice = Number(regData.total_price || 0);
          if (totalPaid >= totalPrice && totalPrice > 0 && regData.status === "pending") {
            await supabase
              .from("registrations")
              .update({ status: "confirmed" })
              .eq("id", payment.registration_id);
          }

          if (totalPaid >= totalPrice && totalPrice > 0) {
            await supabase
              .from("commissions")
              .update({ status: "paid" })
              .eq("registration_id", payment.registration_id);
          }
        }
      }
    }

    // 4. Log activity
    try {
      const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
      const { getSessionUser } = await import("@/features/auth/services/authActions");
      const user = await getSessionUser();
      await recordActivityLog(
        "created",
        `Mencatat pembayaran tagihan ${payment.code} sebesar Rp ${payAmount.toLocaleString("id-ID")}${note ? ` (${note})` : ""}`,
        "Payment",
        payment.id,
        user?.id,
        payment.branch_id
      );
    } catch (e) {
      console.error("Failed to record activity log for payment:", e);
    }

    revalidatePath("/payments");
    revalidatePath("/dashboard");
    revalidatePath("/commissions");
    if (payment.registration_id) {
      revalidatePath(`/payments/${payment.registration_id}`);
      revalidatePath(`/registrations/${payment.registration_id}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error in recordPaymentAction:", err);
    return { error: err.message || "Gagal mencatat pembayaran." };
  }
}

