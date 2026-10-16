import { Icon, IconName } from "@/components/ui/Icon";

interface StatsCardProps {
  label: string;
  value: string;
  icon: IconName;
  color?: "teal" | "blue" | "green" | "amber" | "purple" | "red";
  sub?: string;
}

const colorMap = {
  teal: "bg-teal-50 text-teal-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
};

export function StatsCard({
  label,
  value,
  icon,
  color = "teal",
  sub,
}: StatsCardProps) {
  const cls = colorMap[color] ?? colorMap.teal;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 card-hover cursor-default group">
      <div className={`h-12 w-12 rounded-xl grid place-items-center shrink-0 ${cls} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 truncate">{label}</p>
        <p className="text-xl font-bold text-gray-800 truncate group-hover:text-teal-700 transition-colors duration-200">{value}</p>
        {sub && <p className="text-[11px] text-gray-400 truncate">{sub}</p>}
      </div>
    </div>
  );
}
