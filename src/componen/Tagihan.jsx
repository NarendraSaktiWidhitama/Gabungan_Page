import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Tagihan() {
  const [data, setData] = useState([]);
  const [jenis, setJenis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  const fetchData = async (filterJenis = "") => {
    if (!loading) setLoading(true);
    try {
      if (!showContent) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const dataUrl = filterJenis
        ? `http://localhost:5000/data?jenis=${encodeURIComponent(filterJenis)}`
        : "http://localhost:5000/data";

      const [r1, r2] = await Promise.all([
        axios.get(dataUrl),
        axios.get("http://localhost:5000/jenis"),
      ]);

      const reversedData = [...r1.data].reverse();

      setData(reversedData);
      setJenis(r2.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      if (!showContent) setTimeout(() => setShowContent(true), 50);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const val = e.target.value;
    fetchData(val);
  };

  const handleToggleStatus = async (item) => {
    const newStatus = !item.status;
    const result = await Swal.fire({
      title: "Yakin ingin ubah status?",
      text: newStatus
        ? "Status akan diubah menjadi Lunas."
        : "Status akan diubah menjadi Belum Lunas.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, ubah!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:5000/data/${item.id}`, {
          status: newStatus,
        });

        setData((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, status: newStatus } : d))
        );

        Swal.fire({
          title: "Berhasil!",
          text: newStatus
            ? "Selamat Tagihan telah dilunasi!"
            : "Tagihan dikembalikan menjadi belum lunas.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (err) {
        Swal.fire("Error!", "Terjadi kesalahan saat mengubah status.", "error");
      }
    }
  };

  const handleDelete = async (d) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang sudah dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/data/${d.id}`);
        setData((prev) => prev.filter((x) => x.id !== d.id));
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data berhasil dihapus.",
          showConfirmButton: false,
          timer: 1200,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus data.",
        });
      }
    }
  };

  if (loading && !showContent)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-emerald-500"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">
            Memuat tagihan
          </p>
        </div>
      </div>
    );

  const baseAnimation = showContent
    ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
    : "opacity-0 translate-y-4";

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidnav />
      <div
        className={`flex-1 p-8 lg:ml-56 transition-all overflow-x-hidden ${baseAnimation}`}
      >
        <div className="bg-gradient-to-r from-emerald-300 to-emerald-400 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <i className="ri-file-list-3-fill text-3xl"></i>
            <h1 className="text-2xl font-bold">Daftar Tagihan</h1>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="font-medium mr-2">Filter jenis:</label>
            <select
              className="border rounded px-3 py-1 transition-all"
              onChange={handleFilterChange}
            >
              <option value="">Semua</option>
              {jenis.map((j) => (
                <option key={j.id} value={j.nama}>
                  {j.nama}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigate("/tambahdata")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
          >
            + Tambah Data
          </button>
        </div>

        {/* 🧾 Bagian tabel yang sudah diperbaiki */}
        <div className="bg-white p-5 rounded-lg shadow-xl overflow-hidden">
          <div className="w-full overflow-x-auto md:overflow-x-hidden">
            <table className="w-full text-[15px] border-collapse table-fixed">
              <thead className="bg-gradient-to-r from-emerald-300 to-emerald-300">
                <tr>
                  <th className="py-2 px-3 w-[40px]">No</th>
                  <th className="py-2 px-3 w-[160px]">Nama</th>
                  <th className="py-2 px-3 w-[200px]">Email</th>
                  <th className="py-2 px-3 w-[130px]">Jenis</th>
                  <th className="py-2 px-3 w-[110px]">Jumlah</th>
                  <th className="py-2 px-3 w-[110px]">Tanggal</th>
                  <th className="py-2 px-3 w-[100px]">Status</th>
                  <th className="py-2 px-3 w-[150px]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`${d.status ? "bg-green-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="py-2 px-3 text-right">{i + 1}</td>
                    <td
                      className="py-2 px-3 truncate max-w-[150px]"
                      title={d.nama}
                    >
                      {d.nama}
                    </td>
                    <td
                      className="py-2 px-3 truncate max-w-[180px]"
                      title={d.email}
                    >
                      {d.email}
                    </td>
                    <td
                      className="py-2 px-3 text-center truncate max-w-[120px]"
                      title={d.jenis}
                    >
                      {d.jenis}
                    </td>
                    <td className="py-2 px-3 text-right text-nowrap">
                      Rp {d.jumlah?.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center text-nowrap">
                      {d.tanggal
                        ? new Date(d.tanggal).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td
                      className={`py-2 px-3 text-center font-semibold text-nowrap ${
                        d.status ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {d.status ? "Lunas" : "Belum Lunas"}
                    </td>
                    <td className="py-2 px-3 flex justify-center gap-1">
                      <button
                        onClick={() => navigate(`/edit/${d.id}`)}
                        className="p-1 text-lg hover:scale-125 transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(d)}
                        className="p-1 text-lg hover:scale-125 transition"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => handleToggleStatus(d)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded transition text-nowrap"
                      >
                        Ubah data
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-6 text-gray-500 text-center">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* 🧾 End tabel */}
      </div>
    </div>
  );
}

export default Tagihan;