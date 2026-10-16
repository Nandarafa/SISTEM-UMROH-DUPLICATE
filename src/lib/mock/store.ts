import type {
  Agent,
  Airline,
  Announcement,
  BankAccount,
  Branch,
  Commission,
  DocumentRow,
  EquipmentRow,
  Guide,
  Hotel,
  Manasik,
  ManifestRow,
  PackageRow,
  Payment,
  Pilgrim,
  Registration,
} from "@/types/database.types";

export const mockBranches: Branch[] = [
  { id: "1", code: "JKT", name: "Kantor Pusat Jakarta", city: "Jakarta", phone: "021-7654321", email: "pusat@example.com", is_active: true, is_head_office: true },
  { id: "2", code: "SBY", name: "Cabang Surabaya", city: "Surabaya", phone: "031-1234567", email: "surabaya@example.com", is_active: true, is_head_office: false },
];

export const mockPackages: PackageRow[] = [
  { id: "1", branch_id: "1", name: "Umroh Reguler 9 Hari", code: "UMR-REG-9", type: "umroh", price: 28500000, quota: 45, remaining: 12, duration_days: 9, departure_date: "2026-11-12", departure_city: "Jakarta", status: "open" },
  { id: "2", branch_id: "1", name: "Umroh Plus Turki", code: "UMR-TR-12", type: "umroh", price: 36500000, quota: 40, remaining: 8, duration_days: 12, departure_date: "2026-12-03", departure_city: "Jakarta", status: "open" },
  { id: "3", branch_id: "1", name: "Haji Furoda", code: "HAJ-FUR", type: "haji", price: 165000000, quota: 20, remaining: 4, duration_days: 30, departure_date: "2027-05-20", departure_city: "Jakarta", status: "open" },
  { id: "4", branch_id: "1", name: "Haji Plus", code: "HAJ-PLS", type: "haji_plus", price: 125000000, quota: 25, remaining: 9, duration_days: 24, departure_date: "2027-05-18", departure_city: "Jakarta", status: "open" },
];

export const mockPilgrims: Pilgrim[] = [
  { id: "1", branch_id: "1", code: "JMH-001", name: "Ahmad Fauzi", gender: "male", phone: "081234567890", email: "jamaah@example.com", city: "Jakarta", passport_number: "A1234567", agent_name: "Hasan Basri" },
  { id: "2", branch_id: "1", code: "JMH-002", name: "Budi Santoso", gender: "male", phone: "081234567891", email: "jamaah2@example.com", city: "Bekasi", passport_number: "B2234567", agent_name: "Siti Aminah" },
  { id: "3", branch_id: "1", code: "JMH-003", name: "Citra Lestari", gender: "female", phone: "081234567892", email: "jamaah3@example.com", city: "Depok", passport_number: "C3234567", agent_name: "Rahmat Hidayat" },
  { id: "4", branch_id: "1", code: "JMH-004", name: "Dewi Anggraini", gender: "female", phone: "081234567893", email: "jamaah4@example.com", city: "Tangerang", passport_number: "D4234567", agent_name: "Hasan Basri" },
  { id: "5", branch_id: "1", code: "JMH-005", name: "Eko Prasetyo", gender: "male", phone: "081234567894", email: "jamaah5@example.com", city: "Jakarta", passport_number: "E5234567", agent_name: "Siti Aminah" },
];

export const mockRegistrations: Registration[] = [
  { id: "1", code: "REG-001", pilgrim_name: "Ahmad Fauzi", package_name: "Umroh Reguler 9 Hari", status: "confirmed", total_price: 28500000, registered_at: "2026-03-12" },
  { id: "2", code: "REG-002", pilgrim_name: "Budi Santoso", package_name: "Umroh Plus Turki", status: "confirmed", total_price: 36500000, registered_at: "2026-01-12" },
  { id: "3", code: "REG-003", pilgrim_name: "Citra Lestari", package_name: "Haji Plus", status: "pending", total_price: 125000000, registered_at: "2025-12-14" },
  { id: "4", code: "REG-004", pilgrim_name: "Dewi Anggraini", package_name: "Haji Furoda", status: "confirmed", total_price: 165000000, registered_at: "2026-01-16" },
];

export const mockPayments: Payment[] = [
  { id: "1", code: "PAY-001", pilgrim_name: "Ahmad Fauzi", type: "dp", amount: 10000000, paid_amount: 10000000, status: "paid", due_date: "2026-04-01" },
  { id: "2", code: "PAY-002", pilgrim_name: "Ahmad Fauzi", type: "installment", amount: 8500000, paid_amount: 4000000, status: "partial", due_date: "2026-07-01" },
  { id: "3", code: "PAY-003", pilgrim_name: "Budi Santoso", type: "settlement", amount: 36500000, paid_amount: 36500000, status: "paid", due_date: "2026-02-01" },
  { id: "4", code: "PAY-004", pilgrim_name: "Citra Lestari", type: "dp", amount: 25000000, paid_amount: 0, status: "unpaid", due_date: "2026-01-20" },
];

export const mockHotels: Hotel[] = [
  { id: "1", name: "Swissôtel Al Maqam Makkah", city: "Mekah", star: 5, distance_to_masjid: 100 },
  { id: "2", name: "Anwar Al Madinah Mövenpick", city: "Madinah", star: 5, distance_to_masjid: 80 },
  { id: "3", name: "Anjum Hotel Makkah", city: "Mekah", star: 4, distance_to_masjid: 400 },
];

export const mockAirlines: Airline[] = [
  { id: "1", name: "Saudi Arabian Airlines", code: "SV", transit: "Langsung" },
  { id: "2", name: "Garuda Indonesia", code: "GA", transit: "Langsung" },
  { id: "3", name: "Emirates", code: "EK", transit: "Transit Dubai" },
];

export const mockAgents: Agent[] = [
  { id: "1", code: "AG-DEMO1", name: "Hasan Basri", phone: "081234560000", commission_rate: 7.5 },
  { id: "2", code: "AG-DEMO2", name: "Siti Aminah", phone: "081234560001", commission_rate: 5 },
  { id: "3", code: "AG-DEMO3", name: "Rahmat Hidayat", phone: "081234560002", commission_rate: 6 },
];

export const mockGuides: Guide[] = [
  { id: "1", code: "MT-001", name: "Ustadz Abdullah", specialization: "Manasik & Fikih Haji" },
  { id: "2", code: "MT-002", name: "Ustadz Rahman", specialization: "Sejarah Sirah" },
];

export const mockDocuments: DocumentRow[] = [
  { id: "1", pilgrim_name: "Ahmad Fauzi", type: "ktp", label: "KTP", status: "verified" },
  { id: "2", pilgrim_name: "Ahmad Fauzi", type: "passport", label: "Paspor", status: "pending" },
  { id: "3", pilgrim_name: "Budi Santoso", type: "ktp", label: "KTP", status: "uploaded" },
  { id: "4", pilgrim_name: "Citra Lestari", type: "vaccine", label: "Sertifikat Vaksin", status: "pending" },
];

export const mockCommissions: Commission[] = [
  { id: "1", agent_name: "Siti Aminah", amount: 1825000, status: "paid" },
  { id: "2", agent_name: "Rahmat Hidayat", amount: 7500000, status: "pending" },
  { id: "3", agent_name: "Hasan Basri", amount: 12375000, status: "approved" },
];

export const mockAnnouncements: Announcement[] = [
  { id: "1", title: "Pelunasan Umroh Reguler", body: "Mohon segera melunasi biaya paket sebelum H-30 keberangkatan.", audience: "pilgrim", is_published: true },
  { id: "2", title: "Jadwal Manasik Akbar", body: "Manasik akbar akhir bulan ini di aula utama. Wajib hadir.", audience: "all", is_published: true },
];

export const mockManasik: Manasik[] = [
  { id: "1", title: "Manasik 1 — Ihram & Umroh", date: "2026-10-20", location: "Aula Jakarta", guide_name: "Ustadz Abdullah" },
  { id: "2", title: "Manasik Akbar", date: "2026-10-28", location: "Masjid Al-Hikmah", guide_name: "Ustadz Rahman" },
];

export const mockManifests: ManifestRow[] = [
  { id: "1", package_name: "Umroh Reguler 9 Hari", pilgrim_name: "Ahmad Fauzi", room_number: "412", bus_number: "B1", seat_number: "12" },
  { id: "2", package_name: "Umroh Plus Turki", pilgrim_name: "Budi Santoso", room_number: "208", bus_number: "B2", seat_number: "4" },
];

export const mockEquipment: EquipmentRow[] = [
  { id: "1", pilgrim_name: "Ahmad Fauzi", item: "Koper 24\"", status: "handed" },
  { id: "2", pilgrim_name: "Ahmad Fauzi", item: "Kain Ihram", status: "pending" },
  { id: "3", pilgrim_name: "Budi Santoso", item: "Seragam", status: "handed" },
];

export const mockBanks: BankAccount[] = [
  { id: "1", bank_name: "Bank Syariah Indonesia", account_number: "7001234567", account_holder: "PT Travel Umroh Haji" },
  { id: "2", bank_name: "Bank Muamalat", account_number: "8009876543", account_holder: "PT Travel Umroh Haji" },
];
