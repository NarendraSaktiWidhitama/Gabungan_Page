import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import gambar from "../assets/Logo.png"

function Tambahdata() {
  const navigate = useNavigate();
  const [jenis, setJenis] = useState([]);
  const [master, setMaster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    jenis: "",
    jumlah: "",
    tanggal: "",
    status: false,
    level: "",
    kelas: "",
  });

  const fetchData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [dataJenis, dataMaster] = await Promise.all([
        axios.get("http://localhost:5000/jenis"),
        axios.get("http://localhost:5000/masterdata"),
      ]);

      const aktifJenis = dataJenis.data.filter((item) => {
        const aktifValue =
          typeof item.aktif === "string"
            ? item.aktif.toLowerCase()
            : item.aktif;

        return (
          aktifValue === true ||
          aktifValue === 1 ||
          aktifValue === "aktif" ||
          aktifValue === "true"
        );
      });

      setJenis(aktifJenis);
      setMaster(dataMaster.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setShowContent(true), 50);
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ambil semua data dari jenis & masterdata
      const [dataJenis, dataMaster] = await Promise.all([
        axios.get("http://localhost:5000/jenis"),
        axios.get("http://localhost:5000/masterdata"),
      ]);

      // Filter hanya jenis yang aktif
      const aktifJenis = dataJenis.data.filter((item) => {
        const aktifValue =
          typeof item.aktif === "string"
            ? item.aktif.toLowerCase()
            : item.aktif;

        return (
          aktifValue === true ||
          aktifValue === 1 ||
          aktifValue === "aktif" ||
          aktifValue === "true"
        );
      });

      // 🔥 Filter hanya siswa
      const hanyaSiswa = dataMaster.data.filter(
        (item) =>
          item.level?.toLowerCase() === "siswa" ||
          item.kategori?.toLowerCase() === "siswa"
      );

      setJenis(aktifJenis);
      setMaster(hanyaSiswa);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setShowContent(true), 50);
    }
  };

  fetchData();
}, []);

  const handleSelectNama = (e) => {
    const id = e.target.value;
    const selected = master.find((m) => m.id === id);

    setForm((prev) => ({
      ...prev,
      nama: selected?.nama || "",
      email: selected?.email || "",
      level: selected?.level || "",
      kelas: selected?.kelas || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/data", {
        ...form,
        jumlah: Number(form.jumlah),
        status: false,
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data tagihan berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/tagihan");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Cek koneksi atau data yang dimasukkan.",
      });
    }
  };

  if (loading && !showContent)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-emerald-500"></div>
      </div>
    );

  const baseAnimation = showContent
    ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
    : "opacity-0 translate-y-4";

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidnav />
      <div className={`flex-1 p-8 ml-56 ${baseAnimation}`}>
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg ml-65 my-20">
          <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center space-x-2">
            <img className="w-10 -ml-2" src={gambar} alt="" />
            Formulir Tagihan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAMA */}
            <select
              onChange={handleSelectNama}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Pilih Nama</option>
              {master.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama}
                </option>
              ))}
            </select>

            {/* EMAIL */}
            <input
              name="email"
              value={form.email}
              readOnly
              className="w-full border px-4 py-2 bg-gray-100 rounded"
            />

            {/* JENIS */}
            <select
              name="jenis"
              value={form.jenis}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Pilih Jenis Tagihan</option>
              {jenis.map((j) => (
                <option key={j.id} value={j.nama}>
                  {j.nama}
                </option>
              ))}
            </select>

            {/* JUMLAH */}
            <input
              name="jumlah"
              value={form.jumlah}
              onChange={handleChange}
              type="number"
              placeholder="Jumlah"
              className="w-full border px-4 py-2 rounded"
              required
            />

            {/* TANGGAL */}
            <input
              name="tanggal"
              type="date"
              value={form.tanggal}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />

            <div className="pt-4 flex gap-3">
              <button className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600">
                Simpan Tagihan
              </button>
              <button
                onClick={() => navigate("/tagihan")}
                type="button"
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
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

export default Tambahdata;