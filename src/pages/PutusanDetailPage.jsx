// src/pages/PutusanDetailPage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL_PUSAT || "http://localhost:5001/api/v1";
const API_KEY = import.meta.env.VITE_API_KEY_PUSAT || "veritas-pusat-key-2024";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
}

function PutusanDetailPage() {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);
  const [relatedDecisions, setRelatedDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDecision = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gateway akan handle proxy ke Daerah secara otomatis untuk detail request
        const resp = await fetch(`${API_BASE_URL}/putusan/${id}`, {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        // Related decisions hanya dari Pusat (no proxy needed)
        const relatedDecisionsResp = await fetch(`${API_BASE_URL}/putusan?page=1&limit=5`, {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        const jsonRelated = await relatedDecisionsResp.json();

        if (relatedDecisionsResp.ok && Array.isArray(jsonRelated.data)) {
          const related = jsonRelated.data  
            .filter((p) => p.id.toString() !== id.toString())
            .map((p) => ({
              id: p.id,
              number: p.nomor_putusan || "-",
              title: `Putusan ${p.lembaga?.nama_lembaga || "Pengadilan"} Nomor ${p.nomor_putusan || "-"}`,
              decisionDate: formatDate(p.tanggal_putusan),
            }));
          if (!cancelled) setRelatedDecisions(related);
        } 

        if (!resp.ok) {
          if (resp.status === 404) throw new Error("Putusan tidak ditemukan");
          throw new Error(`Gagal memuat data (${resp.status})`);
        }

        const json = await resp.json();
        const p = json.data;
        if (!p) throw new Error("Data putusan kosong");

        // Data sudah merged oleh gateway (dari Pusat + Daerah)
        const mapped = {
          id: p.id,
          court: p.lembaga?.nama_lembaga || "Pengadilan",
          directory: p.klasifikasi?.nama || "-",
          register: formatDate(p.tanggal_musyawarah || p.created_at),
          decisionDate: formatDate(p.tanggal_putusan || p.created_at),
          uploadDate: formatDate(p.tanggal_upload || p.created_at),
          number: p.nomor_putusan || "-",
          title: `Putusan ${p.lembaga?.nama_lembaga || "Pengadilan"} Nomor ${p.nomor_putusan || "-"}`,
          dateText: `Tanggal ${formatDate(p.tanggal_putusan)} — ${
            p.penuntut_umum?.nama || "Penuntut Umum"
          } VS ${
            Array.isArray(p.terdakwa) && p.terdakwa.length > 0
              ? p.terdakwa[0].nama || "Terdakwa"
              : "Terdakwa"
          }`,
          views: Math.floor(Math.random() * 300),
          comments: Math.floor(Math.random() * 120),
          amar_putusan: p.amar_putusan || "Amar putusan tidak tersedia",
          catatan_amar: p.catatan_amar || p.amar_lainya || null,
          // Download URL - jika ada url_dokumen, gunakan download endpoint dari ServerDaerah
          url_dokumen: p.url_dokumen 
            ? `${p.lembaga?.url_api}/putusan/${p.id_putusan_daerah || p.id}/download`
            : null,
          hakim_ketua: p.hakim_ketua?.nama || (typeof p.hakim_ketua === 'string' ? p.hakim_ketua : null),
          penuntut_umum: p.penuntut_umum?.nama || (typeof p.penuntut_umum === 'string' ? p.penuntut_umum : null),
          panitera: p.panitera?.nama || (typeof p.panitera === 'string' ? p.panitera : null),
          kata_kunci: p.kata_kunci?.nama || (typeof p.kata_kunci === 'string' ? p.kata_kunci : null),
          terdakwa:
            Array.isArray(p.terdakwa) && p.terdakwa.length > 0
              ? p.terdakwa.map((t) => t.nama || t).filter(Boolean)
              : [],
          hakim_anggota:
            Array.isArray(p.hakim_anggota) && p.hakim_anggota.length > 0
              ? p.hakim_anggota.map((h) => h.nama || h).filter(Boolean)
              : [],
          _daerahFallback: p._daerahFallback || false,
        };

        if (!cancelled) {
          setDecision(mapped);
        }
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError(err.message); 
        setDecision(null);
        setRelatedDecisions([]);
        
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDecision();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse"></div>
          <div className="h-8 w-full rounded bg-slate-200 animate-pulse"></div>
          <div className="h-32 w-full rounded bg-slate-200 animate-pulse"></div>
        </div>
      </section>
    );
  }

  if (!decision) {
    return (
      <section className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-xl bg-white px-4 py-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-800">
            Putusan tidak ditemukan
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {error || "Data putusan tidak tersedia dari server."}
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
          >
            Kembali ke daftar putusan
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav className="flex flex-wrap items-center gap-1">
            <Link to="/" className="hover:text-slate-700">
              Beranda
            </Link>
            <span>/</span>
            <Link to="/putusan" className="hover:text-slate-700">
              Putusan
            </Link>
            <span>/</span>
            <span className="text-slate-700">
              {decision.number || `ID ${decision.id}`}
            </span>
          </nav>

          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-sm border border-black px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            Kembali ke daftar
          </Link>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full space-y-4 rounded-sm border bg-white p-4 shadow-sm md:p-5 lg:w-[68%]">
            <header className="border-b pb-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {decision.court} · {decision.directory}
              </p>
              <h1 className="mt-1 text-lg font-semibold text-slate-900 md:text-xl">
                {decision.title}
              </h1>
              <p className="mt-1 text-xs text-slate-600">
                Nomor: <span className="font-medium text-slate-800">{decision.number}</span>
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                <span>
                  Register: <span className="font-medium text-slate-700">{decision.register}</span>
                </span>
                <span>
                  Putus: <span className="font-medium text-slate-700">{decision.decisionDate}</span>
                </span>
                <span>
                  Upload:{" "}
                  <span className="font-medium text-slate-700">
                    {decision.uploadDate}
                  </span>
                </span>
              </div>
            </header>

            <section className="rounded-lg bg-slate-50 px-3 py-3 text-xs text-slate-700">
              <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Ringkasan Singkat
              </h2>
              <p>{decision.dateText}</p>
            </section>

            <section className="space-y-2 text-xs text-slate-700">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Metadata Putusan
              </h2>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-[11px] text-slate-500">Pengadilan</p>
                  <p className="font-medium text-slate-800">{decision.court}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Direktori</p>
                  <p className="font-medium text-slate-800">{decision.directory}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Nomor Putusan</p>
                  <p className="font-medium text-slate-800">{decision.number}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Tanggal Register</p>
                  <p className="font-medium text-slate-800">{decision.register}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Tanggal Putusan</p>
                  <p className="font-medium text-slate-800">{decision.decisionDate}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Tanggal Upload</p>
                  <p className="font-medium text-slate-800">{decision.uploadDate}</p>
                </div>
                {decision.hakim_ketua && (
                  <div>
                    <p className="text-[11px] text-slate-500">Hakim Ketua</p>
                    <p className="font-medium text-slate-800">{decision.hakim_ketua}</p>
                  </div>
                )}
                {decision.hakim_anggota?.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-500">Hakim Anggota</p>
                    <p className="font-medium text-slate-800">{decision.hakim_anggota.join(", ")}</p>
                  </div>
                )}
                {decision.panitera && (
                  <div>
                    <p className="text-[11px] text-slate-500">Panitera</p>
                    <p className="font-medium text-slate-800">{decision.panitera}</p>
                  </div>
                )}
                {decision.penuntut_umum && (
                  <div>
                    <p className="text-[11px] text-slate-500">Penuntut Umum</p>
                    <p className="font-medium text-slate-800">{decision.penuntut_umum}</p>
                  </div>
                )}
                {decision.terdakwa?.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-500">Terdakwa</p>
                    <p className="font-medium text-slate-800">{decision.terdakwa.join(", ")}</p>
                  </div>
                )}
                {decision.kata_kunci && (
                  <div>
                    <p className="text-[11px] text-slate-500">Kata Kunci</p>
                    <p className="font-medium text-slate-800">{decision.kata_kunci}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-2 text-xs text-slate-700">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Amar Putusan
              </h2>
              <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3">
                {decision.amar_putusan || "Konten amar putusan belum tersedia dari server."}
              </p>
            </section>

            {decision.catatan_amar && (
              <section className="space-y-2 text-xs text-slate-700">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Catatan Amar
                </h2>
                <p className="rounded-lg border border-dashed border-amber-200 bg-amber-50 px-3 py-3 text-amber-900">
                  {decision.catatan_amar}
                </p>
              </section>
            )}

            <section className="border-t pt-3">
              <p className="text-[11px] text-slate-500">
                Dokumen lengkap tersedia dalam bentuk PDF pada server pengadilan
                <span className="font-medium text-slate-700"> {decision.court}</span>.
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {decision.url_dokumen ? (
                  <button
                    onClick={async () => {
                      try {
                        const resp = await fetch(decision.url_dokumen, {
                          headers: {
                            "x-api-key": API_KEY,
                          },
                        });
                        if (!resp.ok) throw new Error("Download gagal");
                        const blob = await resp.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `Putusan_${decision.number.replace(/\//g, "-")}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (err) {
                        alert("Gagal download dokumen: " + err.message);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 font-semibold text-white shadow-sm hover:bg-sky-700"
                  >
                    📄 Unduh PDF
                  </button>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-2 font-semibold text-slate-500"
                  >
                    PDF belum tersedia
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
                >
                  🔗 Salin tautan putusan
                </button>
              </div>
            </section>
          </div>

          <aside className="w-full space-y-3 lg:w-[32%]">
            <div className="rounded-sm border bg-white p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Putusan Lain dalam Direktori Ini
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">{decision.directory}</p>

              <div className="mt-3 space-y-2 text-xs">
                {relatedDecisions.length === 0 && (
                  <p className="text-slate-500">Belum ada putusan lain untuk direktori ini.</p>
                )}

                {relatedDecisions.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/putusan/${rel.id}`}
                    className="block rounded-lg border border-slate-100 px-2 py-2 hover:border-sky-200 hover:bg-sky-50"
                  >
                    <p className="text-[11px] text-slate-500">{rel.number}</p>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-2">{rel.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default PutusanDetailPage;
