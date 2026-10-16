export interface Student {
  id: string;
  name: string;
  passportNumber: string;
  package: string;
  status: "Terdaftar" | "Dokumen Lengkap" | "Visa Terbit" | "Siap Berangkat";
  phone: string;
}

export async function getStudents(): Promise<Student[]> {
  return Promise.resolve([
    {
      id: "JAM-001",
      name: "Muhammad Rizky Pratama",
      passportNumber: "A9823145",
      package: "Umroh Reguler Syawal 12 Hari",
      status: "Siap Berangkat",
      phone: "+62 812-3456-7890",
    },
    {
      id: "JAM-002",
      name: "Siti Nurhaliza",
      passportNumber: "B4512984",
      package: "Umroh Plus Turki 14 Hari",
      status: "Visa Terbit",
      phone: "+62 821-9876-5432",
    },
    {
      id: "JAM-003",
      name: "Bambang Pamungkas",
      passportNumber: "C1294812",
      package: "Umroh Reguler Syawal 12 Hari",
      status: "Dokumen Lengkap",
      phone: "+62 856-1234-9988",
    },
    {
      id: "JAM-004",
      name: "Dewi Lestari",
      passportNumber: "A1129384",
      package: "Umroh VIP Ramadhan",
      status: "Terdaftar",
      phone: "+62 878-3344-5566",
    },
  ]);
}
