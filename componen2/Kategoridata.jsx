import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidnav from "../src/componen/Sidnav";
import Swal from "sweetalert2";
import gambar from "../public/Logo.png"

function Kategoridata() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [nama, setNama] = useState("");

  const loadData = async () => {
    const res = await axios.get("http://localhost:5000/kategori");
    setData(res.data.reverse());
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setNama("");
    setEditId(null);
  };

  const openTambah = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setNama(item.nama);
    setShowModal(true);
  };

  const simpanData = async () => {
    if (!nama.trim()) {
      return Swal.fire("Oops!", "Nama kategori tidak boleh kosong", "warning");
    }

    if (editId === null) {
      await axios.post("http://localhost:5000/kategori", { nama });
      Swal.fire("Berhasil", "Kategori berhasil ditambahkan", "success");
    } else {
      await axios.put(`http://localhost:5000/kategori/${editId}`, { nama });
      Swal.fire("Berhasil", "Kategori berhasil diupdate", "success");
    }

    setShowModal(false);
    loadData();
  };

  const deleteData = async (id) => {
    const ask = await Swal.fire({
      title: "Hapus kategori?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!ask.isConfirmed) return;

    await axios.delete(`http://localhost:5000/kategori/${id}`);
    loadData();
    Swal.fire("Dihapus", "Kategori berhasil dihapus", "success");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidnav />

      <div className="flex-1 p-8 ml-56">
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-emerald-300 to-emerald-400 px-5 py-4 rounded-md shadow">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <i className="ri-group-fill"></i> Kategori Data (Level)
          </h1>
          <button
            onClick={openTambah}
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
                <th className="p-2">Kategori</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.map((d, i) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{d.nama}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => openEdit(d)} className="mr-3">✏️</button>
                    <button onClick={() => deleteData(d.id)}>🗑️</button>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    Belum ada kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center">
          <Sidnav />
          <div className="bg-white p-8 rounded-lg shadow w-100 ml-50">
            <h2 className="text-lg font-bold mb-4 text-center flex items-center justify-center space-x-2">
              <img className="w-10 -ml-2" src={gambar} alt="" />
              {editId === null ? "Tambah Kategori" : "Edit Kategori"}
            </h2>

            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama kategori..."
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={simpanData}
                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kategoridata;