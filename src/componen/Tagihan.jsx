import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../config/api";

function Tagihan() {
  const [data, setData] = useState([]);
  const [jenis, setJenis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const navigate = useNavigate();

  const isLunas = (d) => d.status === "LUNAS";

  const fetchData = async (filterJenis = "") => {
    if (!loading) setLoading(true);

    try {
      if (!showContent) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const res = await axios.get(`${BASE_URL}/keuangan`);
      let result = res.data;

      if (filterJenis) {
        result = result.filter(
          (d) => d.jenisTagihan?.nama === filterJenis
        );
      }

      setData(result.reverse());
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
    fetchData(e.target.value);
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === "LUNAS" ? "BELUM LUNAS" : "LUNAS";

    const result = await Swal.fire({
      title: "Yakin ingin ubah status?",
      text: `Status akan diubah menjadi ${newStatus}`,
      icon: "question",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${BASE_URL}/keuangan/${item.id}`, {
          ...item,
          status: newStatus,
        });


        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Status berhasil diubah menjadi ${newStatus}`,
          timer: 1200,
          showConfirmButton: false,
        });

        fetchData();
      } catch (err) {
        Swal.fire("Error", "Gagal mengubah status", "error");
      }
    }
  };

  const handleDelete = async (d) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang sudah dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      await axios.delete(`${BASE_URL}/keuangan/${d.id}`);
      fetchData();
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

        <div className="bg-white p-5 rounded-lg shadow-xl overflow-hidden">
          <div className="w-full overflow-x-auto md:overflow-x-hidden">
            <table className="w-full text-[15px] border-collapse table-fixed">
              {/* ===== HEADER TABEL (INI YANG TADI HILANG) ===== */}
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
                    className={isLunas(d) ? "bg-green-50" : "hover:bg-gray-50"}
                  >
                    <td className="py-2 px-3 text-right">{i + 1}</td>
                    <td className="py-2 px-3 truncate">{d.nama}</td>
                    <td className="py-2 px-3 truncate">{d.email}</td>
                    <td className="py-2 px-3 text-center">
                      {d.jenisTagihan?.nama || "-"}
                      </td>
                    <td className="py-2 px-3 text-right">
                      Rp {d.jumlah?.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {d.tanggal
                        ? new Date(d.tanggal).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td
                      className={`py-2 px-3 text-center font-semibold ${
                        isLunas(d) ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isLunas(d) ? "Lunas" : "Belum Lunas"}
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
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded transition"
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
      </div>
    </div>
  );
}

export default Tagihan;