// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL_PUSAT || "http://localhost:5001/api/v1";
const API_KEY = import.meta.env.VITE_API_KEY_PUSAT || "veritas-pusat-key-2024";

const DIRECTORIES = [];

const COURTS = [];

const ITEMS_PER_PAGE = 10;


function LandingPage() {
    const [selectedDir, setSelectedDir] = useState(null);
    const [selectedPN, setSelectedPN] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    // State untuk data dari backend
    const [decisions, setDecisions] = useState([]);
    const [directories, setDirectories] = useState([{ name: "Semua Direktori", id: null, count: 0 }]);
    const [courts, setCourts] = useState([{ name: "Semua Pengadilan", id: null, count: 0 }]);
    const [years, setYears] = useState([{ tahun: "Semua Tahun", id: null, total_putusan: 0 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [keywordQuery, setKeywordQuery] = useState("");
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 0 });

    // Fetch putusan dari ServerPusat backend
    useEffect(() => {
        const fetchPutusan = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.append("page", currentPage);
                params.append("limit", ITEMS_PER_PAGE);
                
                if (searchQuery) params.append("search", searchQuery);
                if (keywordQuery) params.append("search", keywordQuery);
                if (selectedYear) params.append("id_tahun", selectedYear);
                if (selectedPN) params.append("id_lembaga", selectedPN);
                if (selectedDir) params.append("id_klasifikasi", selectedDir);

                const response = await fetch(
                    `${API_BASE_URL}/putusan?${params.toString()}`,
                    {
                        headers: {
                            "x-api-key": API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();
                
                // Transform data dari backend ke format yang sesuai dengan komponen
                if (data.data && Array.isArray(data.data)) {
                    const transformedDecisions = data.data.map((putusan) => ({
                        id: putusan.id,
                        court: putusan.lembaga?.nama_lembaga || "Pengadilan",
                        directory: putusan.klasifikasi?.nama || "Umum",
                        register: putusan.tanggal_upload ? new Date(putusan.tanggal_upload).toLocaleDateString("id-ID") : "-",
                        decisionDate: putusan.tanggal_putusan ? new Date(putusan.tanggal_putusan).toLocaleDateString("id-ID") : "-",
                        uploadDate: new Date(putusan.created_at).toLocaleDateString("id-ID"),
                        number: putusan.nomor_putusan,
                        title: `Putusan ${putusan.lembaga?.nama_lembaga || "Pengadilan"} Nomor ${putusan.nomor_putusan}`,
                        dateText: `Tahun ${putusan.tahun?.tahun || "-"} — ${putusan.jenis_putusan || "Putusan"}`,
                    }));

                    setDecisions(transformedDecisions);
                    
                    // Simpan pagination info dari API
                    if (data.pagination) {
                        setPagination(data.pagination);
                    }
                }
            } catch (err) {
                console.error("Error fetching putusan:", err);
                setError(err.message);
                setDecisions([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce fetch untuk search
        const timer = setTimeout(fetchPutusan, 500);
        return () => clearTimeout(timer);
    }, [currentPage, searchQuery, keywordQuery, selectedYear, selectedPN, selectedDir]);


    // Fetch klasifikasi untuk direktori
    useEffect(() => {
        const fetchKlasifikasi = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/klasifikasi`, {
                    headers: {
                        "x-api-key": API_KEY,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.data && Array.isArray(data.data)) {
                        const newDirs = [
                            { name: "Semua Direktori", id: null, count: 0 },
                            ...data.data.map((k) => ({
                                name: k.nama,
                                id: k.id,
                                count: k.total_putusan || 0,
                            })),
                        ];
                        setDirectories(newDirs);
                    }
                }
            } catch (err) {
                console.error("Error fetching klasifikasi:", err);
            }
        };

        fetchKlasifikasi();
    }, []);

    // Fetch tahun
    useEffect(() => {
        const fetchTahun = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/tahun`, {
                    headers: {
                        "x-api-key": API_KEY,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.data && Array.isArray(data.data)) {
                        const newYears = [
                            { tahun: "Semua Tahun", id: null, total_putusan: 0 },
                            ...data.data.map((t) => ({
                                tahun: t.tahun,
                                id: t.id,
                                total_putusan: t.total_putusan || 0,
                            })),
                        ];
                        setYears(newYears);
                    }
                }
            } catch (err) {
                console.error("Error fetching tahun:", err);
            }
        };

        fetchTahun();
    }, []);

    // Fetch lembaga (courts)
    useEffect(() => {
        const fetchLembaga = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/lembaga`, {
                    headers: {
                        "x-api-key": API_KEY,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.data && Array.isArray(data.data)) {
                        const newCourts = [
                            { name: "Semua Pengadilan", id: null, count: 0 },
                            ...data.data.map((l) => ({
                                name: l.nama_lembaga,
                                id: l.id,
                                count: 0,
                            })),
                        ];
                        setCourts(newCourts);
                    }
                }
            } catch (err) {
                console.error("Error fetching lembaga:", err);
            }
        };

        fetchLembaga();
    }, []);

    // Use decisions directly (already paginated from API)
    const paginatedDecisions = decisions;
    const totalItems = pagination.total;
    const totalPages = pagination.pages;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;

    const handleChangeDir = (id) => {
        setSelectedDir(id);
        setCurrentPage(1); 
    };

    const handleChangeYear = (id) => {
        setSelectedYear(id);
        setCurrentPage(1);
    };

    const handleChangePN = (id) => {
        setSelectedPN(id);
        setCurrentPage(1);
    };

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

  return (
    <section className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Judul besar */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Gerbang Putusan Terdistribusi Nasional
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Portal pencarian putusan pengadilan dari seluruh Indonesia, berbasis
            arsitektur sistem terdistribusi yang terintegrasi dengan server
            pengadilan daerah.
          </p>
        </header>

        {/* FLEX 2 KOLOM */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full space-y-4 lg:w-[30%]">
            {/* Box 1: Pencarian */}
            <div className="rounded-sm border bg-white shadow-sm">
              <div className="border-b px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Pencarian Putusan
                </h2>
              </div>
              <div className="space-y-3 px-4 py-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Nomor Perkara / Putusan
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Contoh: 1234/Pid.B/2025"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Kata Kunci
                  </label>
                  <input
                    type="text"
                    value={keywordQuery}
                    onChange={(e) => setKeywordQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Narkotika, perceraian, pajak, ..."
                  />
                </div>

              </div>
            </div>

            {/* Box 2: Direktori */}
            <div className="rounded-sm border bg-white shadow-sm">
                <div className="border-b px-4 py-3">
                    <h2 className="text-sm font-semibold text-slate-800">
                    Direktori
                    </h2>
                </div>
                <ul className="px-4 py-3 text-sm">
                    {directories.map((dir) => (
                    <li key={dir.id || 'all'} className="mb-1 last:mb-0">
                        <button
                        type="button"
                        onClick={() => handleChangeDir(dir.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-50 ${
                            selectedDir === dir.id
                            ? "bg-slate-100 font-semibold text-slate-900"
                            : "text-slate-700"
                        }`}
                        >
                          <span>{dir.name}</span>
                        {dir.count > 0 && (
                            <span className="ml-2 rounded-full bg-slate-200 px-2 text-[10px] font-semibold text-slate-700">
                            {dir.count.toLocaleString("id-ID")}
                            </span>
                        )}
                        </button>
                    </li>
                    ))}
                </ul>
            </div>


            {/* Box 3: Tahun */}
            <div className="rounded-sm border bg-white shadow-sm">
              <div className="border-b px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Tahun Putusan
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 px-4 py-3">
                {years.map((year) => (
                  <button
                    key={year.id || 'all'}
                    type="button"
                    onClick={() => handleChangeYear(year.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      selectedYear === year.id
                        ? "border-sky-600 bg-sky-50 text-sky-700"
                        : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {year.tahun}
                  </button>
                ))}
              </div>
            </div>

            {/* Box 4: Pengadilan */}
            <div className="rounded-sm border bg-white shadow-sm">
                <div className="border-b px-4 py-3">
                    <h2 className="text-sm font-semibold text-slate-800">
                    Pengadilan
                    </h2>
                </div>
                <ul className="px-4 py-3 text-sm">
                    {courts.map((pn) => (
                    <li key={pn.id || 'all'} className="mb-1 last:mb-0">
                        <button
                        type="button"
                        onClick={() => handleChangePN(pn.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-50 ${
                            selectedPN === pn.id

                            ? "bg-slate-100 font-semibold text-slate-900"
                            : "text-slate-700"
                        }`}
                        >
                        <span>{pn.name}</span>
                        {pn.count > 0 && (
                            <span className="ml-2 rounded-full bg-slate-200 px-2 text-[10px] font-semibold text-slate-700">
                            {pn.count.toLocaleString("id-ID")}
                            </span>
                        )}
                        </button>
                    </li>
                    ))}
                </ul>
            </div>
          </aside>

          {/* KANAN: daftar putusan */}
          <main className="w-full rounded-sm border bg-white p-4 shadow-sm md:p-5 lg:w-[70%]">
            {/* Header + tabs */}
            <div className="border-b pb-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900 md:text-lg">
                  Putusan Mahkamah Agung
                </h2>
                <p className="text-xs text-slate-500">
                  Direktori:{" "}
                  <span className="font-medium text-slate-700">
                    {directories.find(d => d.id === selectedDir)?.name || "Semua Direktori"}
                  </span>{" "}
                  · Tahun:{" "}
                  <span className="font-medium text-slate-700">
                    {years.find(y => y.id === selectedYear)?.tahun || "Semua Tahun"}
                  </span>
                </p>
              </div>

            
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                Terjadi kesalahan: {error}. Menampilkan data dummy sebagai fallback.
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="mt-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2 border-b border-dashed border-slate-200 pb-4 last:border-0">
                    <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                    <div className="h-3 w-full rounded bg-slate-200"></div>
                    <div className="h-3 w-2/3 rounded bg-slate-200"></div>
                  </div>
                ))}
              </div>
            )}

            {/* List putusan */}
            {!loading && (
            <div className="mt-4 space-y-4">
              {paginatedDecisions.map((d) => (
                <article
                  key={d.id}
                  className="border-b border-dashed border-slate-200 pb-4 last:border-0 last:pb-0"
                >
                  <p className="mb-1 text-[11px] text-slate-500">
                    Pengadilan &gt; {d.court} &gt; {d.directory} &gt; {d.number}
                  </p>
                  <p className="mb-1 text-[11px] text-slate-500">
                    Register : {d.register} — Upload
                    : {d.uploadDate}
                  </p>

                  <Link
                    to={`/putusan/${d.id}`}
                    className="text-sm font-semibold text-sky-700 hover:underline"
                  >
                    {d.title}
                  </Link>

                  <p className="mt-1 text-xs text-slate-600">{d.dateText}</p>
                </article>
              ))}
            </div>
            )}

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t pt-3 text-xs text-slate-600 md:flex-row">
                <p>
                  Menampilkan{" "}
                  <span className="font-semibold">
                    {totalItems === 0 ? 0 : startIndex + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-semibold">
                    {Math.min(endIndex, totalItems)}
                  </span>{" "}
                  dari <span className="font-semibold">{totalItems.toLocaleString('id-ID')}</span>{" "}
                  putusan
                </p>

                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`rounded-md border px-2 py-1 ${
                      pagination.page === 1
                        ? "cursor-not-allowed border-slate-200 text-slate-300"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    ‹
                  </button>

                  {/* tombol halaman sederhana */}
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                      // Tampilkan max 5 tombol halaman
                    if (totalPages > 5) {
                      if (page === 1 || page === totalPages || (page >= pagination.page - 1 && page <= pagination.page + 1)) {
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => goToPage(page)}
                            className={`min-w-8 rounded-md border px-2 py-1 text-center ${
                              pagination.page === page
                                ? "border-sky-600 bg-sky-50 text-sky-700"
                                : "border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === 2 && pagination.page > 3) {
                        return (
                          <span key="dots-start" className="px-1">...</span>
                        );
                      } else if (page === totalPages - 1 && pagination.page < totalPages - 2) {
                        return (
                          <span key="dots-end" className="px-1">...</span>
                        );
                      }
                    } else {
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => goToPage(page)}
                          className={`min-w-8 rounded-md border px-2 py-1 text-center ${
                            pagination.page === page
                              ? "border-sky-600 bg-sky-50 text-sky-700"
                              : "border-slate-300 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  })}

                  <button
                    type="button"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className={`rounded-md border px-2 py-1 ${
                      pagination.page === totalPages
                        ? "cursor-not-allowed border-slate-200 text-slate-300"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
