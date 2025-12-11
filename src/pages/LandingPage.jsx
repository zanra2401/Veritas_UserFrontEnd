// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

const DIRECTORIES = [
    { name: "Semua Direktori", count: 0 },
    { name: "Perdata Agama", count: 7155723 },
    { name: "Perdata", count: 1185074 },
    { name: "Pidana Umum", count: 1043191 },
    { name: "Pidana Khusus", count: 757222 },
    { name: "TUN", count: 91483 },
    { name: "Perdata Khusus", count: 53580 },
    { name: "Pidana Militer", count: 34135 },
    { name: "Pajak", count: 13037 },
];

const PN = [
    { name: "Bojonegoro", count: 20 },
    { name: "Surabaya", count: 7155723 },
    { name: "Bandung", count: 1185074 },
    { name: "Malang", count: 1043191 },
    { name: "Semarang", count: 757222 },
    { name: "Yogyakarta", count: 91483 },
];

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

const DUMMY_DECISIONS = [
  {
    id: 1,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "29-08-2025",
    decisionDate: "19-09-2025",
    uploadDate: "05-12-2025",
    number: "2645 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 2645 PK/PID.SUS/2025",
    dateText: "Tanggal 19 September 2025 — Penuntut Umum VS M. DENDI SAPUTRA Bin DEDDI SUTOMO (Terpidana)",
    views: 79,
    comments: 41,
  },
  {
    id: 2,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "15-10-2025",
    decisionDate: "12-11-2025",
    uploadDate: "05-12-2025",
    number: "3289 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 3289 PK/PID.SUS/2025",
    dateText: "Tanggal 12 November 2025 — Penuntut Umum VS ARIS ALAMIN Bin M. SYUKRI (Alm) Alias INDRA alias SYARIEF (Terpidana)",
    views: 69,
    comments: 34,
  },
  {
    id: 3,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Korupsi",
    register: "02-09-2025",
    decisionDate: "25-10-2025",
    uploadDate: "06-12-2025",
    number: "1102 K/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 1102 K/PID.SUS/2025",
    dateText: "Tanggal 25 Oktober 2025 — Penuntut Umum VS DRS. H. AGUS SALIM, M.Si (Terdakwa)",
    views: 124,
    comments: 56,
  },
  {
    id: 4,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Perlindungan Anak",
    register: "10-08-2025",
    decisionDate: "05-09-2025",
    uploadDate: "01-12-2025",
    number: "889 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 889 PK/PID.SUS/2025",
    dateText: "Tanggal 05 September 2025 — Penuntut Umum VS HERMANTO Bin SUPARMAN (Terpidana)",
    views: 45,
    comments: 12,
  },
  {
    id: 5,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "20-09-2025",
    decisionDate: "15-10-2025",
    uploadDate: "07-12-2025",
    number: "2990 K/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 2990 K/PID.SUS/2025",
    dateText: "Tanggal 15 Oktober 2025 — Penuntut Umum VS RICKY PRATAMA Alias KIKI (Terdakwa)",
    views: 88,
    comments: 20,
  },
  {
    id: 6,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Lingkungan Hidup",
    register: "01-07-2025",
    decisionDate: "28-08-2025",
    uploadDate: "02-12-2025",
    number: "542 K/PID.SUS-LH/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 542 K/PID.SUS-LH/2025",
    dateText: "Tanggal 28 Agustus 2025 — Penuntut Umum VS PT. SAWIT MAKMUR ABADI (Terdakwa Korporasi)",
    views: 210,
    comments: 89,
  },
  {
    id: 7,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > ITE",
    register: "12-10-2025",
    decisionDate: "30-11-2025",
    uploadDate: "08-12-2025",
    number: "1450 K/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 1450 K/PID.SUS/2025",
    dateText: "Tanggal 30 November 2025 — Penuntut Umum VS DONI SETIAWAN, S.Kom (Terdakwa)",
    views: 340,
    comments: 112,
  },
  {
    id: 8,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "05-09-2025",
    decisionDate: "10-10-2025",
    uploadDate: "03-12-2025",
    number: "2771 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 2771 PK/PID.SUS/2025",
    dateText: "Tanggal 10 Oktober 2025 — Penuntut Umum VS SITI AMINAH Binti KASIM (Terpidana)",
    views: 55,
    comments: 8,
  },
  {
    id: 9,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Korupsi",
    register: "18-08-2025",
    decisionDate: "22-09-2025",
    uploadDate: "04-12-2025",
    number: "1205 K/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 1205 K/PID.SUS/2025",
    dateText: "Tanggal 22 September 2025 — Penuntut Umum VS IR. H. MOCHTAR LUBIS (Terdakwa)",
    views: 180,
    comments: 67,
  },
  {
    id: 10,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "25-10-2025",
    decisionDate: "20-11-2025",
    uploadDate: "09-12-2025",
    number: "3301 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 3301 PK/PID.SUS/2025",
    dateText: "Tanggal 20 November 2025 — Penuntut Umum VS ANDI FIRMANSYAH Bin RUSLI (Terpidana)",
    views: 62,
    comments: 15,
  },
  {
    id: 11,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Perikanan",
    register: "14-06-2025",
    decisionDate: "15-08-2025",
    uploadDate: "01-12-2025",
    number: "302 K/PID.SUS-PRK/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 302 K/PID.SUS-PRK/2025",
    dateText: "Tanggal 15 Agustus 2025 — Penuntut Umum VS NGUYEN VAN LONG (Terdakwa)",
    views: 95,
    comments: 22,
  },
  {
    id: 12,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "30-09-2025",
    decisionDate: "28-10-2025",
    uploadDate: "06-12-2025",
    number: "3110 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 3110 PK/PID.SUS/2025",
    dateText: "Tanggal 28 Oktober 2025 — Penuntut Umum VS YULIA RAHMAWATI Alias YULI (Terpidana)",
    views: 70,
    comments: 29,
  },
  {
    id: 13,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Pencucian Uang (TPPU)",
    register: "11-09-2025",
    decisionDate: "18-10-2025",
    uploadDate: "05-12-2025",
    number: "190 K/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 190 K/PID.SUS/2025",
    dateText: "Tanggal 18 Oktober 2025 — Penuntut Umum VS BENNY SUDARSO (Terdakwa)",
    views: 250,
    comments: 99,
  },
  {
    id: 14,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "08-11-2025",
    decisionDate: "02-12-2025",
    uploadDate: "10-12-2025",
    number: "3456 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 3456 PK/PID.SUS/2025",
    dateText: "Tanggal 02 Desember 2025 — Penuntut Umum VS KHAIRUL ANAM Bin ZAINUDDIN (Terpidana)",
    views: 58,
    comments: 10,
  },
  {
    id: 15,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Kepabeanan",
    register: "22-07-2025",
    decisionDate: "14-09-2025",
    uploadDate: "03-12-2025",
    number: "776 K/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 776 K/PID.SUS/2025",
    dateText: "Tanggal 14 September 2025 — Penuntut Umum VS CHEN WEI (Terdakwa)",
    views: 110,
    comments: 31,
  },
  {
    id: 16,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "03-10-2025",
    decisionDate: "01-11-2025",
    uploadDate: "07-12-2025",
    number: "3188 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 3188 PK/PID.SUS/2025",
    dateText: "Tanggal 01 November 2025 — Penuntut Umum VS FERDIANSYAH Alias FERDI (Terpidana)",
    views: 82,
    comments: 44,
  },
  {
    id: 17,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Kehutanan",
    register: "19-08-2025",
    decisionDate: "25-09-2025",
    uploadDate: "02-12-2025",
    number: "660 K/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 660 K/PID.SUS/2025",
    dateText: "Tanggal 25 September 2025 — Penuntut Umum VS UDIN GAMBUT (Terdakwa)",
    views: 135,
    comments: 25,
  },
  {
    id: 18,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "27-09-2025",
    decisionDate: "22-10-2025",
    uploadDate: "06-12-2025",
    number: "2905 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 2905 PK/PID.SUS/2025",
    dateText: "Tanggal 22 Oktober 2025 — Penuntut Umum VS RINI ANGGRAINI Binti JOKO (Terpidana)",
    views: 49,
    comments: 18,
  },
  {
    id: 19,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Korupsi",
    register: "05-11-2025",
    decisionDate: "05-12-2025",
    uploadDate: "10-12-2025",
    number: "1355 K/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 1355 K/PID.SUS/2025",
    dateText: "Tanggal 05 Desember 2025 — Penuntut Umum VS DR. H. SYAMSUL BAHRI, M.Pd (Terdakwa)",
    views: 305,
    comments: 140,
  },
  {
    id: 20,
    court: "MAHKAMAH AGUNG",
    directory: "Pidana Khusus > Narkotika dan Psikotropika",
    register: "12-09-2025",
    decisionDate: "08-10-2025",
    uploadDate: "04-12-2025",
    number: "2840 PK/PID.SUS/2025",
    title: "Putusan MAHKAMAH AGUNG Nomor 2840 PK/PID.SUS/2025",
    dateText: "Tanggal 08 Oktober 2025 — Penuntut Umum VS BAGAS KARAMOY (Terpidana)",
    views: 77,
    comments: 26,
  },
];

const ITEMS_PER_PAGE = 10;

function LandingPage() {
    const [selectedDir, setSelectedDir] = useState("Semua Direktori");
    const [selectedPN, setSelectedPN] = useState("Bojonegoro");

    const [selectedYear, setSelectedYear] = useState(2025);

    const [currentPage, setCurrentPage] = useState(1);

    const filteredDecisions = DUMMY_DECISIONS;

    const totalItems = filteredDecisions.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedDecisions = filteredDecisions.slice(startIndex, endIndex);

    const handleChangeDir = (name) => {
        setSelectedDir(name);
        setCurrentPage(1); 
    };

    const handleChangeYear = (year) => {
        setSelectedYear(year);
        setCurrentPage(1);
    };

    const handleChangePN = (pn) => {
        setSelectedPN(pn);
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Narkotika, perceraian, pajak, ..."
                  />
                </div>
                <button className="cursor-pointer mt-1 w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700">
                  Cari Putusan
                </button>
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
                    {DIRECTORIES.map((dir) => (
                    <li key={dir.name} className="mb-1 last:mb-0">
                        <button
                        type="button"
                        onClick={() => handleChangeDir(dir.name)}
                        className={`cursor-pointer flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-50 ${
                            selectedDir === dir.name
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
                {YEARS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleChangeYear(year)}
                    className={`cursor-pointer rounded-sm border px-3 py-1 text-xs font-medium transition ${
                      selectedYear === year
                        ? "border-sky-600 bg-sky-50 text-sky-700"
                        : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {year}
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
                    {PN.map((pn) => (
                    <li key={pn.name} className="mb-1 last:mb-0">
                        <button
                        type="button"
                        onClick={() => handleChangePN(pn.name)}
                        className={`cursor-pointer flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-50 ${
                            selectedPN === pn.name
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
                    {selectedDir}
                  </span>{" "}
                  · Tahun:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedYear}
                  </span>
                </p>
              </div>

            
            </div>

            {/* List putusan */}
            <div className="mt-4 space-y-4">
              {paginatedDecisions.map((d) => (
                <article
                  key={d.id}
                  className="border-b border-dashed border-slate-200 pb-4 last:border-0 last:pb-0"
                >
                  <p className="mb-1 text-[11px] text-slate-500">
                    Pengadilan &gt; {d.court} &gt; {d.directory}
                  </p>
                  <p className="mb-1 text-[11px] text-slate-500">
                    Register : {d.register} — Putus : {d.decisionDate} — Upload
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
                  dari <span className="font-semibold">{totalItems}</span>{" "}
                  putusan
                </p>

                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`cursor-pointer rounded-md border px-2 py-1 ${
                      currentPage === 1
                        ? "cursor-not-allowed border-slate-200 text-slate-300"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    ‹
                  </button>

                  {/* tombol halaman sederhana */}
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`cursor-pointer  min-w-[2rem] rounded-md border px-2 py-1 text-center ${
                          currentPage === page
                            ? "border-sky-600 bg-sky-50 text-sky-700"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`cursor-pointer  rounded-md border px-2 py-1 ${
                      currentPage === totalPages
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
