import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "outline";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const styles = {
    primary: "bg-brand text-white hover:brightness-105 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
  }[variant];

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 btn-press cursor-pointer disabled:opacity-60 disabled:pointer-events-none hover:shadow-sm",
        styles,
        className,
      )}
      {...props}
    />
  );
}
