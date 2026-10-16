import { PageContainer } from "@/components/layout/PageContainer";
import { getStudents } from "@/features/students/services/studentService";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <PageContainer
      title="Daftar Students / Peserta Jamaah"
      description="Manajemen data calon jamaah, kelengkapan paspor & status visa"
    >
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID Jamaah</th>
              <th className="px-6 py-4">Nama Lengkap</th>
              <th className="px-6 py-4">No. Paspor</th>
              <th className="px-6 py-4">Paket Pilihan</th>
              <th className="px-6 py-4">No. Telepon</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800">
                  {student.id}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-700">{student.passportNumber}</td>
                <td className="px-6 py-4 text-slate-700">{student.package}</td>
                <td className="px-6 py-4 text-slate-500">{student.phone}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
