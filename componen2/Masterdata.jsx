import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "../src/componen/Sidnav";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Masterdata() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const [kategoriList, setKategoriList] = useState([]); // <- TAMBAHAN

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/masterdata");
      const result = res.data.reverse();
      setData(result);
      setFiltered(result);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setShowContent(true);
      }, 800);
    }
  };

  // ✅ LOAD KATEGORI DARI API
  const loadKategori = async () => {
    try {
      const res = await axios.get("http://localhost:5000/kategori");
      setKategoriList(res.data);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  useEffect(() => {
    loadData();
    loadKategori(); // <- panggil disini
  }, []);

  useEffect(() => {
    let result = data;

    if (filter !== "Semua") {
      result = result.filter((d) => d.kategori === filter);
    }

    if (search.trim() !== "") {
      result = result.filter(
        (d) =>
          d.nama.toLowerCase().includes(search.toLowerCase()) ||
          d.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [filter, search, data]);

  const deleteData = async (id) => {
    const ask = await Swal.fire({
      title: "Hapus kategori?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!ask.isConfirmed) return;

    await axios.delete(`http://localhost:5000/masterdata/${id}`);
    loadData();
    Swal.fire("Berhasil", "Kategori dihapus", "success");
  };

  if (loading && !showContent)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-emerald-500"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">
            Memuat kategori data
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidnav />

      <div className="flex-1 p-8 ml-56 transition-all">
        <div className="flex justify-between items-center bg-gradient-to-r from-emerald-300 to-emerald-400 px-5 py-4 rounded-md shadow mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <i className="ri-folder-2-fill"></i> Master data
          </h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          {/* Kiri: filter + search */}
          <div className="flex items-center gap-3">
            
            {/* ✅ FILTER SEKARANG DINAMIS */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-2 rounded bg-white shadow"
            >
              <option value="Semua">Semua</option>
              {kategoriList.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Cari nama"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded shadow w-64"
            />
          </div>

          <button
            onClick={() => navigate("/tambahkategori")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Tambah Kategori
          </button>
        </div>

        <div className="bg-white shadow rounded p-5">
          <table className="w-full text-left border-collapse">
            <thead className="bg-emerald-300">
              <tr>
                <th className="p-2">No</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Email</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Jabatan/Kelas</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{d.nama}</td>
                  <td className="p-2">{d.email}</td>
                  <td className="p-2">{d.kategori}</td>
                  <td className="p-2">{d.jabatan}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => navigate(`/editkategori/${d.id}`)}
                      className="mr-3"
                    >
                      ✏️
                    </button>
                    <button onClick={() => deleteData(d.id)}>🗑️</button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    Tidak ada data yang cocok
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Masterdata;