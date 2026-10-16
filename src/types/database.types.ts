export type Branch = {
  id: string;
  code: string;
  name: string;
  city: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  is_head_office: boolean;
};

export type PackageRow = {
  id: string;
  branch_id: string;
  name: string;
  code: string;
  type: "umroh" | "haji" | "haji_plus";
  price: number;
  quota: number;
  remaining: number;
  duration_days: number;
  departure_date: string | null;
  departure_city: string | null;
  status: "draft" | "open" | "full" | "closed";
};

export type Pilgrim = {
  id: string;
  branch_id: string;
  code: string;
  name: string;
  gender: "male" | "female";
  phone: string | null;
  email: string | null;
  city: string | null;
  passport_number: string | null;
  agent_name?: string | null;
};

export type Registration = {
  id: string;
  code: string;
  pilgrim_name: string;
  package_name: string;
  status: "pending" | "confirmed" | "departed" | "cancelled";
  total_price: number;
  registered_at: string;
};

export type Payment = {
  id: string;
  code: string;
  pilgrim_name: string;
  type: "dp" | "installment" | "settlement";
  amount: number;
  paid_amount: number;
  status: "unpaid" | "partial" | "paid";
  due_date: string | null;
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  star: number;
  distance_to_masjid: number | null;
};

export type Airline = {
  id: string;
  name: string;
  code: string | null;
  transit: string | null;
};

export type Agent = {
  id: string;
  code: string;
  name: string;
  phone: string | null;
  commission_rate: number;
};

export type Guide = {
  id: string;
  code: string;
  name: string;
  specialization: string | null;
};

export type DocumentRow = {
  id: string;
  pilgrim_name: string;
  type: string;
  label: string;
  status: "pending" | "uploaded" | "verified" | "rejected";
};

export type Commission = {
  id: string;
  agent_name: string;
  pilgrim_name?: string;
  amount: number;
  status: "pending" | "approved" | "paid";
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  is_published: boolean;
};

export type Manasik = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  guide_name: string | null;
};

export type ManifestRow = {
  id: string;
  package_name: string;
  pilgrim_name: string;
  room_number: string | null;
  bus_number: string | null;
  seat_number: string | null;
};

export type EquipmentRow = {
  id: string;
  pilgrim_name: string;
  item: string;
  status: "pending" | "handed" | "returned";
};

export type BankAccount = {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
};

export type ActivityLog = {
  id: string;
  action: string;
  description: string | null;
  created_at: string;
};
