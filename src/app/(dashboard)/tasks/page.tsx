import { PageContainer } from "@/components/layout/PageContainer";
import { getTasks } from "@/features/tasks/services/taskService";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <PageContainer
      title="Manajemen Tasks / Tugas Operasional"
      description="Tracking penugasan staf, handling hotel, tiket & perlengkapan jamaah"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-teal-600">{task.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    task.priority === "Tinggi"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  Prioritas {task.priority}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-2">{task.title}</h3>
              <div className="text-xs text-slate-500 space-y-1">
                <div>Penanggung Jawab: <span className="font-medium text-slate-700">{task.assignedTo}</span></div>
                <div>Batas Waktu: <span className="font-medium text-slate-700">{task.dueDate}</span></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Status Tugas</span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  task.status === "Selesai"
                    ? "bg-emerald-50 text-emerald-700"
                    : task.status === "Sedang Berjalan"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
