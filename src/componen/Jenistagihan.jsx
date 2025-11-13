import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";
import Swal from "sweetalert2";
import gambar from "../assets/Logo.png"

function Jenistagihan() {
  const [jenis, setJenis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ nama: "", keterangan: "" });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/jenis");
        setJenis(res.data);
        setLoading(false);
        setTimeout(() => setContentVisible(true), 50);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!form.nama.trim()) {
      Swal.fire("Oops", "Nama jenis wajib diisi!", "warning");
      return;
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/jenis/${selectedId}`, form);
        Swal.fire("Berhasil!", "Jenis tagihan berhasil diperbarui", "success");
        setJenis(
          jenis.map((j) =>
            j.id === selectedId ? { ...j, ...form } : j
          )
        );
      } else {
        const res = await axios.post("http://localhost:5000/jenis", {
          ...form,
          aktif: true,
        });
        Swal.fire("Berhasil!", "Jenis tagihan berhasil ditambahkan", "success");
        setJenis([...jenis, res.data]);
      }
      setModal(false);
      setForm({ nama: "", keterangan: "" });
      setEditMode(false);
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm({ nama: item.nama, keterangan: item.keterangan });
    setSelectedId(item.id);
    setEditMode(true);
    setModal(true);
  };

  const handleToggleAktif = async (item) => {
    try {
      const updated = { ...item, aktif: !item.aktif };
      await axios.put(`http://localhost:5000/jenis/${item.id}`, updated);
      setJenis(jenis.map((j) => (j.id === item.id ? updated : j)));
    } catch (err) {
      Swal.fire("Gagal", "Tidak bisa mengubah status aktif", "error");
    }
  };

  const handleDelete = async (item) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Jenis Tagihan?",
      text: `Yakin ingin menghapus "${item.nama}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!konfirmasi.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/jenis/${item.id}`);
      Swal.fire("Terhapus!", "Jenis tagihan berhasil dihapus", "success");
      setJenis(jenis.filter((j) => j.id !== item.id));
    } catch (err) {
      Swal.fire("Gagal", "Tidak bisa menghapus jenis tagihan", "error");
      console.error(err);
    }
  };

  const mainContentAnimationClass = contentVisible
    ? "opacity-100 transform translate-y-0 transition-all duration-700 ease-out"
    : "opacity-0 transform -translate-y-4";

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">
            Memuat jenis tagihan
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidnav />
      <div className={`flex-1 p-8 ml-56 ${mainContentAnimationClass}`}>
        <div className="bg-gradient-to-r from-emerald-300 to-emerald-400 p-4 rounded-lg mb-6 shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
          <i className="ri-price-tag-3-fill text-3xl"></i>
          <h1 className="text-3xl font-bold">Jenis Tagihan</h1>
          </div>
          <button
            onClick={() => {
              setEditMode(false);
              setForm({ nama: "", keterangan: "" });
              setModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            + Tambah Jenis
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl overflow-x-auto">
          <h2 className="font-semibold mb-3 text-lg pb-2">
            Daftar Jenis Tagihan
          </h2>
          <table className="w-full text-center border-collapse">
            <thead className="bg-gradient-to-r from-emerald-300 to-emerald-300">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Nama Jenis</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3">Aktif</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jenis.map((j, i) => (
                <tr key={j.id} className="hover:bg-green-50 border-gray-200">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 font-medium">{j.nama}</td>
                  <td className="p-2">{j.keterangan || "-"}</td>
                  <td className="p-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={j.aktif}
                        onChange={() => handleToggleAktif(j)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer relative 
                        peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px]
                        after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5
                        after:transition-all peer-checked:after:translate-x-full">
                      </div>
                    </label>
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(j)}
                      className="px-3 py-1 rounded hover:scale-110"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(j)}
                      className="px-3 py-1 rounded hover:scale-110"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {jenis.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-gray-500 border">
                    Tidak ada data jenis tagihan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center space-x-2">
                <img className="w-10 -ml-2" src={gambar} alt="" />
                {editMode ? "Edit Jenis Tagihan" : "Tambah Jenis Tagihan"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Jenis"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Keterangan"
                  value={form.keterangan}
                  onChange={(e) =>
                    setForm({ ...form, keterangan: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Jenistagihan;
