import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import gambar from "../assets/Logo.png"

function Editdata() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jenis, setJenis] = useState([]);
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

  useEffect(() => {
    const fetchDataAndForm = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const rJenis = await axios.get("http://localhost:5000/jenis");
        setJenis(rJenis.data);

        const rData = await axios.get(`http://localhost:5000/data/${id}`);
        setForm({
          ...rData.data,
          tanggal: rData.data.tanggal
            ? new Date(rData.data.tanggal).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setShowContent(true);
        }, 50);
      }
    };

    fetchDataAndForm();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Yakin Ingin Mengubah?",
      text: "Data tagihan akan diperbarui.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Ubah Data!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/data/${id}`, {
          ...form,
          jumlah: Number(form.jumlah),
        });

        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data tagihan berhasil diperbarui.",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/tagihan");
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Gagal Update",
          text: "Terjadi kesalahan saat memperbarui data.",
        });
      }
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
            Edit Data Tagihan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nama (Tidak bisa diubah) */}
            <input
              name="nama"
              value={form.nama}
              readOnly
              className="w-full border px-4 py-2 bg-gray-100 rounded"
            />

            {/* Email (Tidak bisa diubah) */}
            <input
              name="email"
              value={form.email}
              readOnly
              className="w-full border px-4 py-2 bg-gray-100 rounded"
            />

            {/* Jenis */}
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

            {/* Jumlah */}
            <input
              name="jumlah"
              value={form.jumlah}
              onChange={handleChange}
              type="number"
              className="w-full border px-4 py-2 rounded"
              required
            />

            {/* Tanggal */}
            <input
              name="tanggal"
              type="date"
              value={form.tanggal}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />

            <div className="pt-4 flex gap-3">
              <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                Simpan Perubahan
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

export default Editdata;