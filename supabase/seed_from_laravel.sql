-- ========================================================
-- SEED DATA IMPORTED FROM sistem_umroh.sql TO SUPABASE
-- Run this in Supabase SQL Editor
-- ========================================================

-- Disable foreign key checks / defer triggers
SET session_replication_role = 'replica';

-- Table: branches
INSERT INTO branches (id, code, name, phone, email, address, city, is_active, is_head_office, created_at, updated_at, deleted_at) VALUES
(1, 'JKT', 'Kantor Pusat Jakarta', '021-7654321', 'pusat@example.com', 'Jl. Melati Indah No. 17, Jakarta Selatan', 'Jakarta', 1, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(2, 'SBY', 'Cabang Surabaya', '031-1234567', 'surabaya@example.com', 'Jl. Pemuda No. 88, Surabaya', 'Surabaya', 1, 0, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL);

-- Table: hotels
INSERT INTO hotels (id, name, city, star, distance_to_masjid, description, is_active, created_at, updated_at, deleted_at) VALUES
(1, 'Swissôtel Al Maqam Makkah', 'Mekah', 5, 100, NULL, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(2, 'Hilton Makkah Convention', 'Mekah', 5, 250, NULL, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(3, 'Anjum Hotel Makkah', 'Mekah', 4, 400, NULL, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(4, 'Anwar Al Madinah Mövenpick', 'Madinah', 5, 80, NULL, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(5, 'Dallah Taibah Hotel', 'Madinah', 4, 150, NULL, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(6, 'Al Eiman Royal Hotel', 'Madinah', 4, 300, NULL, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL);

-- Table: airlines
INSERT INTO airlines (id, name, code, transit, is_active, created_at, updated_at, deleted_at) VALUES
(1, 'Saudi Arabian Airlines', 'SV', 'Langsung', 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(2, 'Garuda Indonesia', 'GA', 'Langsung', 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(3, 'Emirates', 'EK', 'Transit Dubai', 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL);

-- Table: bank_accounts
INSERT INTO bank_accounts (id, branch_id, bank_name, account_number, account_holder, branch_office, is_active, created_at, updated_at, deleted_at) VALUES
(1, 1, 'Bank Syariah Indonesia', '7001234567', 'PT Travel Umroh Haji', 'KCP Jakarta', 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(2, 1, 'Bank Muamalat', '8009876543', 'PT Travel Umroh Haji', 'KCP Jakarta', 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL);

-- Table: agents
INSERT INTO agents (id, branch_id, user_id, code, name, phone, email, address, commission_rate, is_active, created_at, updated_at, deleted_at) VALUES
(1, 1, 3, 'AG-DEMO1', 'Hasan Basri', '081234560000', 'agent@example.com', NULL, 7.50, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(2, 1, 4, 'AG-DEMO2', 'Siti Aminah', '081234560001', 'agent2@example.com', NULL, 5.00, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(3, 1, NULL, 'AG-DEMO3', 'Rahmat Hidayat', '081234560002', 'agent3@example.com', NULL, 6.00, 1, '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL);

-- Table: guides
INSERT INTO guides (id, branch_id, user_id, code, name, gender, phone, email, specialization, bio, is_active, created_at, updated_at, deleted_at) VALUES
(1, 1, 5, 'GD-DEMO1', 'Ustadz Abdullah', 'male', '089876540000', 'muthawif@example.com', 'Fiqih Manasik', NULL, 1, '2026-09-10 04:39:59', '2026-09-10 04:39:59', NULL),
(2, 1, NULL, 'GD-DEMO2', 'Ustadz Fauzan', 'male', '089876540001', 'muthawif2@example.com', 'Fiqih Manasik', NULL, 1, '2026-09-10 04:39:59', '2026-09-10 04:39:59', NULL),
(3, 1, NULL, 'GD-DEMO3', 'Ustadzah Khadijah', 'female', '089876540002', 'muthawif3@example.com', 'Fiqih Manasik', NULL, 1, '2026-09-10 04:39:59', '2026-09-10 04:39:59', NULL);

-- Table: packages
INSERT INTO packages (id, branch_id, name, code, type, price, down_payment, quota, duration_days, departure_date, departure_city, hotel_makkah_id, hotel_madinah_id, airline_id, facilities_included, facilities_excluded, description, status, created_at, updated_at, deleted_at) VALUES
(1, 1, 'Umroh Reguler 9 Hari', 'PKG-UMR9', 'umroh', 28500000.00, 5000000.00, 45, 9, '2026-11-10', 'Jakarta', 1, 4, 1, '[\"Tiket pesawat PP\",\"Hotel bintang 4\\/5\",\"Visa & manasik\",\"Makan 3x sehari\",\"Bus AC\"]', '[\"Pengeluaran pribadi\",\"Kelebihan bagasi\",\"Vaksin\"]', 'Paket perjalanan ibadah dengan bimbingan muthawif berpengalaman.', 'open', '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(2, 1, 'Umroh Plus Turki 12 Hari', 'PKG-UMR12', 'umroh', 36500000.00, 7500000.00, 40, 12, '2026-12-10', 'Jakarta', 2, 5, 2, '[\"Tiket pesawat PP\",\"Hotel bintang 4\\/5\",\"Visa & manasik\",\"Makan 3x sehari\",\"Bus AC\"]', '[\"Pengeluaran pribadi\",\"Kelebihan bagasi\",\"Vaksin\"]', 'Paket perjalanan ibadah dengan bimbingan muthawif berpengalaman.', 'open', '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(3, 1, 'Haji Khusus 2026', 'PKG-HAJ', 'haji', 125000000.00, 25000000.00, 30, 40, '2027-01-10', 'Jakarta', 3, 6, 3, '[\"Tiket pesawat PP\",\"Hotel bintang 4\\/5\",\"Visa & manasik\",\"Makan 3x sehari\",\"Bus AC\"]', '[\"Pengeluaran pribadi\",\"Kelebihan bagasi\",\"Vaksin\"]', 'Paket perjalanan ibadah dengan bimbingan muthawif berpengalaman.', 'open', '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(4, 1, 'Haji Plus Eksklusif', 'PKG-HAJP', 'haji_plus', 165000000.00, 35000000.00, 20, 35, '2027-03-10', 'Jakarta', 1, 4, 1, '[\"Tiket pesawat PP\",\"Hotel bintang 4\\/5\",\"Visa & manasik\",\"Makan 3x sehari\",\"Bus AC\"]', '[\"Pengeluaran pribadi\",\"Kelebihan bagasi\",\"Vaksin\"]', 'Paket perjalanan ibadah dengan bimbingan muthawif berpengalaman.', 'open', '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL),
(5, 2, 'Umroh Akhir Tahun', 'PKG-UMRA', 'umroh', 31000000.00, 6000000.00, 50, 10, '2026-10-10', 'Surabaya', 2, 5, 2, '[\"Tiket pesawat PP\",\"Hotel bintang 4\\/5\",\"Visa & manasik\",\"Makan 3x sehari\",\"Bus AC\"]', '[\"Pengeluaran pribadi\",\"Kelebihan bagasi\",\"Vaksin\"]', 'Paket perjalanan ibadah dengan bimbingan muthawif berpengalaman.', 'open', '2026-09-10 04:39:58', '2026-09-10 04:39:58', NULL);

-- Table: pilgrims
INSERT INTO pilgrims (id, branch_id, user_id, agent_id, code, name, gender, nik, birth_place, birth_date, address, city, phone, email, passport_number, passport_issued_at, passport_expired_at, passport_issued_place, mahram_name, mahram_relation, emergency_contact_name, emergency_contact_phone, health_notes, blood_type, is_active, created_at, updated_at, deleted_at) VALUES
(1, 1, 6, NULL, 'JM-0001', 'Ahmad Fauzi', 'male', '3201000000000001', 'Jakarta', '1975-01-01', 'Jl. Contoh No. 1, Jakarta', 'Jakarta', '081200000001', 'jamaah@example.com', 'A1000000', '2024-09-10', '2029-09-10', 'Jakarta', NULL, NULL, 'Keluarga Ahmad Fauzi', '081300000001', NULL, 'A', 1, '2026-09-10 04:39:59', '2026-09-10 04:39:59', NULL),
(2, 1, 7, 2, 'JM-0002', 'Budi Santoso', 'female', '3201000000000002', 'Jakarta', '1976-02-02', 'Jl. Contoh No. 2, Jakarta', 'Jakarta', '081200000002', 'jamaah2@example.com', 'A1000001', '2024-09-10', '2029-08-10', 'Jakarta', 'Suami Budi Santoso', 'Suami', 'Keluarga Budi Santoso', '081300000002', NULL, 'B', 1, '2026-09-10 04:39:59', '2026-09-10 04:39:59', NULL),
(3, 1, 8, 3, 'JM-0003', 'Citra Lestari', 'male', '3201000000000003', 'Jakarta', '1977-03-03', 'Jl. Contoh No. 3, Jakarta', 'Jakarta', '081200000003', 'jamaah3@example.com', 'A1000002', '2024-09-10', '2029-07-10', 'Jakarta', NULL, NULL, 'Keluarga Citra Lestari', '081300000003', NULL, 'AB', 1, '2026-09-10 04:39:59', '2026-09-10 04:39:59', NULL),
(4, 1, 9, 1, 'JM-0004', 'Dewi Anggraini', 'male', '3201000000000004', 'Jakarta', '1978-04-04', 'Jl. Contoh No. 4, Jakarta', 'Jakarta', '081200000004', 'jamaah4@example.com', 'A1000003', '2024-09-10', '2029-06-10', 'Jakarta', NULL, NULL, 'Keluarga Dewi Anggraini', '081300000004', NULL, 'O', 1, '2026-09-10 04:39:59', '2026-09-10 04:39:59', NULL),
(5, 1, 10, NULL, 'JM-0005', 'Eko Prasetyo', 'female', '3201000000000005', 'Jakarta', '1979-05-05', 'Jl. Contoh No. 5, Jakarta', 'Jakarta', '081200000005', 'jamaah5@example.com', 'A1000004', '2024-09-10', '2029-05-10', 'Jakarta', 'Suami Eko Prasetyo', 'Suami', 'Keluarga Eko Prasetyo', '081300000005', NULL, 'A', 1, '2026-09-10 04:40:00', '2026-09-10 04:40:00', NULL),
(6, 1, 11, 3, 'JM-0006', 'Fitri Handayani', 'male', '3201000000000006', 'Jakarta', '1980-06-06', 'Jl. Contoh No. 6, Jakarta', 'Jakarta', '081200000006', 'jamaah6@example.com', 'A1000005', '2024-09-10', '2029-04-10', 'Jakarta', NULL, NULL, 'Keluarga Fitri Handayani', '081300000006', NULL, 'B', 1, '2026-09-10 04:40:00', '2026-09-10 04:40:00', NULL),
(7, 1, 12, 1, 'JM-0007', 'Gunawan Wibowo', 'male', '3201000000000007', 'Jakarta', '1981-07-07', 'Jl. Contoh No. 7, Jakarta', 'Jakarta', '081200000007', 'jamaah7@example.com', 'A1000006', '2024-09-10', '2029-09-10', 'Jakarta', NULL, NULL, 'Keluarga Gunawan Wibowo', '081300000007', NULL, 'AB', 1, '2026-09-10 04:40:00', '2026-09-10 04:40:00', NULL),
(8, 1, 13, 2, 'JM-0008', 'Hesti Purnama', 'female', '3201000000000008', 'Jakarta', '1982-08-08', 'Jl. Contoh No. 8, Jakarta', 'Jakarta', '081200000008', 'jamaah8@example.com', 'A1000007', '2024-09-10', '2029-08-10', 'Jakarta', 'Suami Hesti Purnama', 'Suami', 'Keluarga Hesti Purnama', '081300000008', NULL, 'O', 1, '2026-09-10 04:40:00', '2026-09-10 04:40:00', NULL),
(9, 1, 14, NULL, 'JM-0009', 'Indra Kusuma', 'male', '3201000000000009', 'Jakarta', '1983-09-09', 'Jl. Contoh No. 9, Jakarta', 'Jakarta', '081200000009', 'jamaah9@example.com', 'A1000008', '2024-09-10', '2029-07-10', 'Jakarta', NULL, NULL, 'Keluarga Indra Kusuma', '081300000009', NULL, 'A', 1, '2026-09-10 04:40:00', '2026-09-10 04:40:00', NULL),
(10, 1, 15, 1, 'JM-0010', 'Joko Widodo', 'male', '3201000000000010', 'Jakarta', '1984-10-10', 'Jl. Contoh No. 10, Jakarta', 'Jakarta', '081200000010', 'jamaah10@example.com', 'A1000009', '2024-09-10', '2029-06-10', 'Jakarta', NULL, NULL, 'Keluarga Joko Widodo', '081300000010', NULL, 'B', 1, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(11, 1, 16, 2, 'JM-0011', 'Kartika Sari', 'female', '3201000000000011', 'Jakarta', '1985-11-11', 'Jl. Contoh No. 11, Jakarta', 'Jakarta', '081200000011', 'jamaah11@example.com', 'A1000010', '2024-09-10', '2029-05-10', 'Jakarta', 'Suami Kartika Sari', 'Suami', 'Keluarga Kartika Sari', '081300000011', NULL, 'AB', 1, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(12, 1, 17, 3, 'JM-0012', 'Lukman Hakim', 'male', '3201000000000012', 'Jakarta', '1986-12-12', 'Jl. Contoh No. 12, Jakarta', 'Jakarta', '081200000012', 'jamaah12@example.com', 'A1000011', '2024-09-10', '2029-04-10', 'Jakarta', NULL, NULL, 'Keluarga Lukman Hakim', '081300000012', NULL, 'O', 1, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL);

-- Table: registrations
INSERT INTO registrations (id, branch_id, pilgrim_id, package_id, agent_id, guide_id, code, status, total_price, registered_at, notes, created_at, updated_at, deleted_at) VALUES
(1, 1, 1, 1, NULL, 1, 'REG-00001', 'confirmed', 28500000.00, '2025-10-10', NULL, '2025-10-10 04:40:01', '2025-10-10 04:40:01', NULL),
(2, 1, 2, 2, 2, 2, 'REG-00002', 'confirmed', 36500000.00, '2025-11-12', NULL, '2025-11-12 04:40:01', '2025-11-12 04:40:01', NULL),
(3, 1, 3, 3, 3, 3, 'REG-00003', 'confirmed', 125000000.00, '2025-12-14', NULL, '2025-12-14 04:40:01', '2025-12-14 04:40:01', NULL),
(4, 1, 4, 4, 1, 1, 'REG-00004', 'confirmed', 165000000.00, '2026-01-16', NULL, '2026-01-16 04:40:01', '2026-01-16 04:40:01', NULL),
(5, 2, 5, 5, NULL, 2, 'REG-00005', 'confirmed', 31000000.00, '2026-02-18', NULL, '2026-02-18 04:40:01', '2026-02-18 04:40:01', NULL),
(6, 1, 6, 1, 3, 3, 'REG-00006', 'confirmed', 28500000.00, '2026-03-20', NULL, '2026-03-20 04:40:01', '2026-03-20 04:40:01', NULL),
(7, 1, 7, 2, 1, 1, 'REG-00007', 'confirmed', 36500000.00, '2026-04-22', NULL, '2026-04-22 04:40:01', '2026-04-22 04:40:01', NULL),
(8, 1, 8, 3, 2, 2, 'REG-00008', 'confirmed', 125000000.00, '2026-05-24', NULL, '2026-05-24 04:40:01', '2026-05-24 04:40:01', NULL),
(9, 1, 9, 4, NULL, 3, 'REG-00009', 'confirmed', 165000000.00, '2026-06-26', NULL, '2026-06-26 04:40:01', '2026-06-26 04:40:01', NULL),
(10, 2, 10, 5, 1, 1, 'REG-00010', 'confirmed', 31000000.00, '2026-07-28', NULL, '2026-07-28 04:40:01', '2026-07-28 04:40:01', NULL),
(11, 1, 11, 1, 2, 2, 'REG-00011', 'confirmed', 28500000.00, '2026-08-30', NULL, '2026-08-30 04:40:01', '2026-08-30 04:40:01', NULL),
(12, 1, 12, 2, 3, 3, 'REG-00012', 'confirmed', 36500000.00, '2026-10-02', NULL, '2026-10-02 04:40:01', '2026-10-02 04:40:01', NULL);

-- Table: payments
INSERT INTO payments (id, branch_id, registration_id, code, type, amount, paid_amount, status, due_date, paid_at, method, bank_account_id, recorded_by, proof_path, note, created_at, updated_at, deleted_at) VALUES
(1, 1, 1, 'REG-00001-DP', 'dp', 5000000.00, 5000000.00, 'paid', '2025-10-12', '2025-10-09', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(2, 1, 1, 'REG-00001-C1', 'installment', 7833333.33, 7833333.33, 'paid', '2025-11-10', '2025-11-07', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(3, 1, 1, 'REG-00001-C2', 'installment', 7833333.33, 7833333.33, 'paid', '2025-12-10', '2025-12-07', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(4, 1, 1, 'REG-00001-C3', 'installment', 7833333.34, 7833333.34, 'paid', '2026-01-10', '2026-01-07', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(5, 1, 2, 'REG-00002-DP', 'dp', 7500000.00, 7500000.00, 'paid', '2025-11-14', '2025-11-11', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(6, 1, 2, 'REG-00002-C1', 'installment', 9666666.67, 9666666.67, 'paid', '2025-12-12', '2025-12-09', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(7, 1, 2, 'REG-00002-C2', 'installment', 9666666.67, 0.00, 'unpaid', '2026-01-12', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(8, 1, 2, 'REG-00002-C3', 'installment', 9666666.66, 0.00, 'unpaid', '2026-02-12', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(9, 1, 3, 'REG-00003-DP', 'dp', 25000000.00, 0.00, 'unpaid', '2025-12-16', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(10, 1, 3, 'REG-00003-C1', 'installment', 33333333.33, 0.00, 'unpaid', '2026-01-14', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(11, 1, 3, 'REG-00003-C2', 'installment', 33333333.33, 0.00, 'unpaid', '2026-02-14', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(12, 1, 3, 'REG-00003-C3', 'installment', 33333333.34, 0.00, 'unpaid', '2026-03-14', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(13, 1, 4, 'REG-00004-DP', 'dp', 35000000.00, 35000000.00, 'paid', '2026-01-18', '2026-01-15', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(14, 1, 4, 'REG-00004-C1', 'installment', 43333333.33, 43333333.33, 'paid', '2026-02-16', '2026-02-13', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(15, 1, 4, 'REG-00004-C2', 'installment', 43333333.33, 43333333.33, 'paid', '2026-03-16', '2026-03-13', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(16, 1, 4, 'REG-00004-C3', 'installment', 43333333.34, 43333333.34, 'paid', '2026-04-16', '2026-04-13', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(17, 2, 5, 'REG-00005-DP', 'dp', 6000000.00, 6000000.00, 'paid', '2026-02-20', '2026-02-17', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(18, 2, 5, 'REG-00005-C1', 'installment', 8333333.33, 8333333.33, 'paid', '2026-03-18', '2026-03-15', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(19, 2, 5, 'REG-00005-C2', 'installment', 8333333.33, 0.00, 'unpaid', '2026-04-18', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(20, 2, 5, 'REG-00005-C3', 'installment', 8333333.34, 0.00, 'unpaid', '2026-05-18', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(21, 1, 6, 'REG-00006-DP', 'dp', 5000000.00, 0.00, 'unpaid', '2026-03-22', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(22, 1, 6, 'REG-00006-C1', 'installment', 7833333.33, 0.00, 'unpaid', '2026-04-20', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(23, 1, 6, 'REG-00006-C2', 'installment', 7833333.33, 0.00, 'unpaid', '2026-05-20', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(24, 1, 6, 'REG-00006-C3', 'installment', 7833333.34, 0.00, 'unpaid', '2026-06-20', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(25, 1, 7, 'REG-00007-DP', 'dp', 7500000.00, 7500000.00, 'paid', '2026-04-24', '2026-04-21', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(26, 1, 7, 'REG-00007-C1', 'installment', 9666666.67, 9666666.67, 'paid', '2026-05-22', '2026-05-19', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(27, 1, 7, 'REG-00007-C2', 'installment', 9666666.67, 9666666.67, 'paid', '2026-06-22', '2026-06-19', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(28, 1, 7, 'REG-00007-C3', 'installment', 9666666.66, 9666666.66, 'paid', '2026-07-22', '2026-07-19', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(29, 1, 8, 'REG-00008-DP', 'dp', 25000000.00, 25000000.00, 'paid', '2026-05-26', '2026-05-23', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(30, 1, 8, 'REG-00008-C1', 'installment', 33333333.33, 33333333.33, 'paid', '2026-06-24', '2026-06-21', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(31, 1, 8, 'REG-00008-C2', 'installment', 33333333.33, 0.00, 'unpaid', '2026-07-24', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(32, 1, 8, 'REG-00008-C3', 'installment', 33333333.34, 0.00, 'unpaid', '2026-08-24', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(33, 1, 9, 'REG-00009-DP', 'dp', 35000000.00, 0.00, 'unpaid', '2026-06-28', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(34, 1, 9, 'REG-00009-C1', 'installment', 43333333.33, 0.00, 'unpaid', '2026-07-26', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(35, 1, 9, 'REG-00009-C2', 'installment', 43333333.33, 0.00, 'unpaid', '2026-08-26', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(36, 1, 9, 'REG-00009-C3', 'installment', 43333333.34, 0.00, 'unpaid', '2026-09-26', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(37, 2, 10, 'REG-00010-DP', 'dp', 6000000.00, 6000000.00, 'paid', '2026-07-30', '2026-07-27', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(38, 2, 10, 'REG-00010-C1', 'installment', 8333333.33, 8333333.33, 'paid', '2026-08-28', '2026-08-25', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(39, 2, 10, 'REG-00010-C2', 'installment', 8333333.33, 8333333.33, 'paid', '2026-09-28', '2026-09-25', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(40, 2, 10, 'REG-00010-C3', 'installment', 8333333.34, 8333333.34, 'paid', '2026-10-28', '2026-10-25', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(41, 1, 11, 'REG-00011-DP', 'dp', 5000000.00, 5000000.00, 'paid', '2026-09-01', '2026-08-29', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(42, 1, 11, 'REG-00011-C1', 'installment', 7833333.33, 7833333.33, 'paid', '2026-09-30', '2026-09-27', 'transfer', NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(43, 1, 11, 'REG-00011-C2', 'installment', 7833333.33, 0.00, 'unpaid', '2026-10-30', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(44, 1, 11, 'REG-00011-C3', 'installment', 7833333.34, 0.00, 'unpaid', '2026-11-30', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(45, 1, 12, 'REG-00012-DP', 'dp', 7500000.00, 0.00, 'unpaid', '2026-10-04', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(46, 1, 12, 'REG-00012-C1', 'installment', 9666666.67, 0.00, 'unpaid', '2026-11-02', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(47, 1, 12, 'REG-00012-C2', 'installment', 9666666.67, 0.00, 'unpaid', '2026-12-02', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(48, 1, 12, 'REG-00012-C3', 'installment', 9666666.66, 0.00, 'unpaid', '2027-01-02', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL);

-- Table: manasik_schedules
INSERT INTO manasik_schedules (id, branch_id, package_id, guide_id, title, date, start_time, end_time, location, description, created_at, updated_at, deleted_at) VALUES
(1, 1, 1, 1, 'Manasik Umroh Reguler 9 Hari #1', '2026-08-21', '08:00:00', '12:00:00', 'Aula Kantor Pusat Jakarta', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(2, 1, 1, 1, 'Manasik Umroh Reguler 9 Hari #2', '2026-09-20', '08:00:00', '12:00:00', 'Aula Kantor Pusat Jakarta', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(3, 1, 2, 2, 'Manasik Umroh Plus Turki 12 Hari #1', '2026-08-22', '08:00:00', '12:00:00', 'Aula Kantor Pusat Jakarta', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(4, 1, 2, 2, 'Manasik Umroh Plus Turki 12 Hari #2', '2026-09-21', '08:00:00', '12:00:00', 'Aula Kantor Pusat Jakarta', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(5, 1, 3, 3, 'Manasik Haji Khusus 2026 #1', '2026-08-23', '08:00:00', '12:00:00', 'Aula Kantor Pusat Jakarta', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(6, 1, 3, 3, 'Manasik Haji Khusus 2026 #2', '2026-09-22', '08:00:00', '12:00:00', 'Aula Kantor Pusat Jakarta', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(7, 1, 4, 1, 'Manasik Haji Plus Eksklusif #1', '2026-08-24', '08:00:00', '12:00:00', 'Aula Kantor Pusat Jakarta', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(8, 1, 4, 1, 'Manasik Haji Plus Eksklusif #2', '2026-09-23', '08:00:00', '12:00:00', 'Aula Kantor Pusat Jakarta', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(9, 2, 5, 2, 'Manasik Umroh Akhir Tahun #1', '2026-08-25', '08:00:00', '12:00:00', 'Aula Cabang Surabaya', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(10, 2, 5, 2, 'Manasik Umroh Akhir Tahun #2', '2026-09-24', '08:00:00', '12:00:00', 'Aula Cabang Surabaya', 'Pembekalan manasik dan tata cara ibadah.', '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL);

-- Table: manasik_attendances
INSERT INTO manasik_attendances (id, manasik_schedule_id, pilgrim_id, status, note, recorded_by, created_at, updated_at) VALUES
(1, 1, 1, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(2, 1, 6, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(3, 1, 11, 'absent', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(4, 3, 2, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(5, 3, 7, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(6, 3, 12, 'absent', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(7, 5, 3, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(8, 5, 8, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(9, 7, 4, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(10, 7, 9, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(11, 9, 5, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01'),
(12, 9, 10, 'present', NULL, NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01');

-- Table: announcements
INSERT INTO announcements (id, branch_id, package_id, created_by, title, body, audience, is_published, publish_at, expires_at, created_at, updated_at, deleted_at) VALUES
(1, 1, NULL, 1, 'Pelunasan Umroh Reguler', 'Mohon segera melunasi biaya paket Umroh Reguler sebelum H-30 keberangkatan.', 'pilgrim', 1, '2026-09-09 04:40:01', NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(2, NULL, NULL, 1, 'Jadwal Manasik Akbar', 'Manasik akbar akan dilaksanakan akhir bulan ini di aula utama. Wajib hadir.', 'all', 1, '2026-09-08 04:40:01', NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL),
(3, 1, NULL, 1, 'Target Komisi Bulanan', 'Selamat kepada para agen! Mari capai target referral bulan ini.', 'agent', 1, '2026-09-07 04:40:01', NULL, '2026-09-10 04:40:01', '2026-09-10 04:40:01', NULL);


SET session_replication_role = 'origin';
