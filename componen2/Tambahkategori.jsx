import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidnav from "../src/componen/Sidnav";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import gambar from "../public/Logo.png"

function Tambahkategori() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    kategori: "",
    jabatan: "",
  });

  const [kelasList, setKelasList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setShowContent(true);
    }, 500);

    axios
      .get("http://localhost:5000/kelas")
      .then((res) => setKelasList(res.data))
      .catch((err) => console.error("Gagal mengambil kelas:", err));

    axios
      .get("http://localhost:5000/kategori")
      .then((res) => {
        console.log("Data kategori dari backend:", res.data);
        setKategoriList(res.data);
      })
      .catch((err) => console.error("Gagal mengambil kategori:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalJabatan = form.jabatan;

    if (form.kategori === "Siswa" && finalJabatan === "") {
      return Swal.fire("Oops!", "Pilih kelas & jurusan!", "warning");
    }

    try {
      await axios.post("http://localhost:5000/masterdata", {
        ...form,
        jabatan: finalJabatan,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/Masterdata");
    } catch (err) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  if (loading && !showContent)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-emerald-500"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">
            Memuat halaman
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidnav />
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full ml-50">
          <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center space-x-2">
            <img className="w-10 -ml-2" src={gambar} alt="" />
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

            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map((k) => (
                <option
                  key={k.id}
                  value={k.kategori || k.nama_kategori || k.nama}
                >
                  {k.kategori || k.nama_kategori || k.nama}
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
                
                {form.kategori === "Guru" && (
                  <input
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleChange}
                  placeholder="Pilih mapel"
                  className="w-full border px-4 py-2 rounded"
                  required
                  />
                  )}
                  
                  {form.kategori === "Karyawan" && (
                    <input
                    name="jabatan"
                    value={form.jabatan}
                    onChange={handleChange}
                    placeholder="Jabatan"
                    className="w-full border px-4 py-2 rounded"
                    required
                    />
                    )}

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="bg-emerald-500 text-white font-semibold px-6 py-2 rounded shadow hover:bg-emerald-600 w-full"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => navigate("/Masterdata")}
                className="bg-gray-400 text-white font-semibold px-6 py-2 rounded shadow hover:bg-gray-500 w-full"
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