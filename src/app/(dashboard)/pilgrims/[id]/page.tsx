import Link from "next/link";
import { notFound } from "next/navigation";
import { getPilgrimDetail } from "@/features/pilgrims/services/pilgrimService";

export default async function PilgrimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pilgrim = await getPilgrimDetail(id);

  if (!pilgrim) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:underline">Beranda</Link>
          <span>&rsaquo;</span>
          <Link href="/pilgrims" className="hover:underline">Jamaah</Link>
          <span>&rsaquo;</span>
          <span className="text-gray-600 font-medium">{pilgrim.name}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">{pilgrim.name}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{pilgrim.code}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Pribadi */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Data Pribadi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Jenis Kelamin</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {pilgrim.gender}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">NIK</span>
                <span className="text-gray-800 font-mono font-medium">{pilgrim.nik}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Tempat / Tanggal Lahir</span>
                <span className="text-gray-800">
                  {pilgrim.birthPlace}, {pilgrim.birthDate} ({pilgrim.age} th)
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Golongan Darah</span>
                <span className="text-gray-800 font-medium">{pilgrim.bloodType}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Telepon</span>
                <a
                  href={`https://wa.me/${pilgrim.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 font-medium hover:underline"
                >
                  {pilgrim.phone}
                </a>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Email</span>
                <span className="text-gray-800">{pilgrim.email}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-400 block mb-1">Alamat</span>
                <span className="text-gray-800">{pilgrim.address}</span>
              </div>
            </div>
          </div>

          {/* Paspor */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Paspor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Nomor Paspor</span>
                <span className="text-gray-800 font-mono font-medium">{pilgrim.passportNumber}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Tempat Penerbitan</span>
                <span className="text-gray-800">{pilgrim.passportIssuedPlace}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Tanggal Terbit</span>
                <span className="text-gray-800">{pilgrim.passportIssuedAt}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Tanggal Kadaluarsa</span>
                <span className="text-gray-800">{pilgrim.passportExpiry}</span>
              </div>
            </div>
          </div>

          {/* Mahram & Kontak Darurat */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Mahram &amp; Kontak Darurat</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Nama Mahram</span>
                <span className="text-gray-800">{pilgrim.mahramName}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Hubungan Mahram</span>
                <span className="text-gray-800">{pilgrim.mahramRelation}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Kontak Darurat</span>
                <span className="text-gray-800">{pilgrim.emergencyContactName}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Telepon Darurat</span>
                <span className="text-gray-800">{pilgrim.emergencyContactPhone}</span>
              </div>
            </div>
          </div>

          {/* Kesehatan */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Kesehatan</h3>
            <p className="text-xs text-gray-800 leading-relaxed">{pilgrim.healthNotes}</p>
          </div>

          {/* Pendaftaran Paket */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Pendaftaran Paket</h3>
            {pilgrim.registrations && pilgrim.registrations.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {pilgrim.registrations.map((reg) => (
                  <div key={reg.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-xs">{reg.packageName}</p>
                      <p className="text-[11px] text-gray-400">
                        {reg.code} &bull; {reg.registeredAt}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                      {reg.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Belum ada pendaftaran paket.</p>
            )}
          </div>
        </div>

        {/* Right Column: Ringkasan Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Ringkasan</h3>
            <dl className="divide-y divide-gray-50 text-xs space-y-3">
              <div className="flex items-center justify-between pt-1">
                <dt className="text-gray-400">Status</dt>
                <dd>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                    Aktif
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between pt-3">
                <dt className="text-gray-400">Cabang</dt>
                <dd className="text-gray-800 font-medium">{pilgrim.branchName}</dd>
              </div>
              <div className="flex items-center justify-between pt-3">
                <dt className="text-gray-400">Agen</dt>
                <dd className="text-gray-800 font-medium">{pilgrim.agentName}</dd>
              </div>
              {pilgrim.guideName && (
                <div className="flex items-center justify-between pt-3">
                  <dt className="text-gray-400">Muthawif</dt>
                  <dd className="text-gray-800 font-medium">{pilgrim.guideName}</dd>
                </div>
              )}
              <div className="flex items-center justify-between pt-3">
                <dt className="text-gray-400">Akun Login</dt>
                <dd>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                    Aktif
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between pt-3">
                <dt className="text-gray-400">Dokumen</dt>
                <dd className="text-gray-800 font-medium">{pilgrim.documentsCount} berkas</dd>
              </div>
            </dl>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link
                href={`/documents/${pilgrim.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition shadow-xs text-center"
              >
                <span>Kelola &amp; Upload Dokumen &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
