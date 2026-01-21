import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidnav from "../src/componen/Sidnav";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import gambar from "../public/Logo.png";

function Tambahkategori() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    kategori: "",
    jabatan: "",
    rfid: "",
  });

  const [kelasList, setKelasList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setShowContent(true);
    }, 500);

    axios.get("http://localhost:5000/kelas")
      .then((res) => setKelasList(res.data))
      .catch((err) => console.error(err));

    axios.get("http://localhost:5000/kategori")
      .then((res) => setKategoriList(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.kategori === "Siswa" && !form.jabatan) {
      return Swal.fire("Oops!", "Pilih kelas & jurusan!", "warning");
    }

    if (!form.rfid) {
      return Swal.fire("Oops!", "RFID wajib diisi!", "warning");
    }

    try {
      await axios.post("http://localhost:5000/masterdata", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil ditambahkan.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/Masterdata");
    } catch (err) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  if (loading && !showContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidnav />
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full ml-50">
          <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
            <img className="w-10" src={gambar} alt="" />
            Tambah Data
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              className="w-full border px-4 py-2 rounded"
              required
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className="w-full border px-4 py-2 rounded"
              required
            />

            <input
              name="rfid"
              value={form.rfid}
              onChange={handleChange}
              placeholder="Masukkan RFID"
              className="w-full border px-4 py-2 rounded"
              required
            />

            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map((k) => (
                <option key={k.id} value={k.nama || k.kategori}>
                  {k.nama || k.kategori}
                </option>
              ))}
            </select>

            {form.kategori === "Siswa" && (
              <select
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              >
                <option value="">Pilih Kelas & Jurusan</option>
                {kelasList.map((k) => (
                  <option key={k.id} value={`${k.kelas} ${k.jurusan}`}>
                    {k.kelas} {k.jurusan}
                  </option>
                ))}
              </select>
            )}

            {form.kategori !== "Siswa" && (
              <input
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
                placeholder="Jabatan / Mapel"
                className="w-full border px-4 py-2 rounded"
                required
              />
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-emerald-500 text-white px-6 py-2 rounded w-full hover:bg-emerald-600"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => navigate("/Masterdata")}
                className="bg-gray-400 text-white px-6 py-2 rounded w-full hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Tambahkategori;