export interface TaskItem {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: "Tinggi" | "Sedang" | "Rendah";
  status: "Belum Dikerjakan" | "Sedang Berjalan" | "Selesai";
}

export async function getTasks(): Promise<TaskItem[]> {
  return Promise.resolve([
    {
      id: "TSK-101",
      title: "Verifikasi Paspor & Buku Kuning Jamaah Batch 2",
      assignedTo: "Staf Dokumen",
      dueDate: "2026-04-15",
      priority: "Tinggi",
      status: "Sedang Berjalan",
    },
    {
      id: "TSK-102",
      title: "Konfirmasi Kamar Hotel Pullman Zamzam Makkah",
      assignedTo: "Tim Handling Saudi",
      dueDate: "2026-04-18",
      priority: "Tinggi",
      status: "Selesai",
    },
    {
      id: "TSK-103",
      title: "Pengiriman Perlengkapan Koper ke Cabang Surabaya",
      assignedTo: "Logistik",
      dueDate: "2026-04-20",
      priority: "Sedang",
      status: "Belum Dikerjakan",
    },
    {
      id: "TSK-104",
      title: "Jadwal Bimbingan Manasik Akbar Online",
      assignedTo: "Muthawif",
      dueDate: "2026-04-22",
      priority: "Sedang",
      status: "Belum Dikerjakan",
    },
  ]);
}
