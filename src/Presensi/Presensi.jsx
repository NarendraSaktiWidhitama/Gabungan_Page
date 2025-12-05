import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../componen/Sidnav";

function Presensi() {
  const [level, setLevel] = useState("");
  const [nama, setNama] = useState("");

  const [kategoriData, setKategoriData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [presensiData, setPresensiData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/kategori").then((res) => {
      setKategoriData(res.data);
    });

    axios.get("http://localhost:5000/masterdata").then((res) => {
      setMasterData(res.data);
    });

    getPresensi();
  }, []);

  const getPresensi = () => {
    axios.get("http://localhost:5000/presensi").then((res) => {
      setPresensiData(res.data);
    });
  };

  const filteredNama = masterData.filter(
    (m) => m.kategori?.toLowerCase() === level.toLowerCase()
  );

  const handleSubmit = async () => {
    if (!level || !nama) {
      Swal.fire({
        icon: "warning",
        title: "Gagal!",
        text: "Level dan Nama harus dipilih!",
      });
      return;
    }

    const selected = masterData.find(
      (m) =>
        m.nama?.toLowerCase() === nama.toLowerCase() &&
        m.kategori?.toLowerCase() === level.toLowerCase()
    );

    if (!selected) {
      Swal.fire({
        icon: "error",
        title: "Data Tidak Ditemukan",
        text: "Pastikan nama dan level sesuai masterdata!",
      });
      return;
    }

    const body = {
      nama: selected.nama,
      kategori: selected.kategori,
      rfid: selected.rfid,     // ✅ AMBIL RFID DARI MASTERDATA
      tanggal: new Date().toLocaleDateString("id-ID"),
      jam_masuk: "-",
      jam_pulang: "-",
      status: "-",
      keterangan: "-"
    };

    await axios.post("http://localhost:5000/presensi", body);

    Swal.fire({
      icon: "success",
      title: "Data Ditambahkan",
      text: `${selected.nama} siap untuk presensi.`,
      timer: 2000,
    });

    setLevel("");
    setNama("");
    getPresensi();
  };

  const handleMasuk = async (item) => {
    if (item.status === "izin") {
      Swal.fire("Sudah Izin", "Tidak bisa presensi masuk.", "info");
      return;
    }

    if (item.jam_masuk !== "-" && item.jam_masuk !== "") {
      Swal.fire({
        icon: "info",
        title: "Sudah Presensi Masuk",
        text: `${item.nama} sudah mencatat jam masuk.`,
      });
      return;
    }

    const result = await Swal.fire({
      title: "Pilih Jenis Presensi",
      showDenyButton: true,
      confirmButtonText: "Masuk",
      denyButtonText: "Izin",
    });

    if (result.isConfirmed) {
      const jamMasuk = new Date().toLocaleTimeString("id-ID");

      await axios.patch(`http://localhost:5000/presensi/${item.id}`, {
        jam_masuk: jamMasuk,
        status: "hadir",
        keterangan: "-"
      });

      Swal.fire({
        icon: "success",
        title: "Presensi Masuk",
        text: `${item.nama} masuk pada ${jamMasuk}`,
      });

      getPresensi();
    }

    if (result.isDenied) {
      const ket = await Swal.fire({
        title: "Masukkan Keterangan Izin",
        input: "text",
        inputPlaceholder: "Contoh: Sakit, Ada keperluan...",
        showCancelButton: true,
      });

      if (!ket.value) return;

      await axios.patch(`http://localhost:5000/presensi/${item.id}`, {
        jam_masuk: "-",
        jam_pulang: "-",
        status: "izin",
        keterangan: ket.value
      });

      Swal.fire({
        icon: "success",
        title: "Izin Dicatat",
        text: `${item.nama} izin: ${ket.value}`,
      });

      getPresensi();
    }
  };

  const handlePulang = async (item) => {
    if (item.status === "izin") {
      Swal.fire("Tidak Bisa", "Hari ini sudah izin.", "info");
      return;
    }

    if (item.jam_pulang !== "-" && item.jam_pulang !== "") {
      Swal.fire({
        icon: "info",
        title: "Sudah Pulang",
        text: `${item.nama} sudah memiliki jam pulang.`,
      });
      return;
    }

    const jamPulang = new Date().toLocaleTimeString("id-ID");

    await axios.patch(`http://localhost:5000/presensi/${item.id}`, {
      jam_pulang: jamPulang,
    });

    Swal.fire({
      icon: "success",
      title: "Jam Pulang Dicatat!",
      text: `${item.nama} pulang pada ${jamPulang}`,
    });

    getPresensi();
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus Presensi?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/presensi/${id}`);
        getPresensi();
      }
    });
  };

  return (
    <div className="flex bg-gray-100">
      <Sidnav />

      <div className="flex-1 p-8 ml-56 transition-all">
        <div className="flex justify-between items-center bg-gradient-to-r from-emerald-300 to-emerald-400 px-5 py-4 rounded-md shadow mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <i className="ri-database-2-fill"></i> Presensi Sekolah
          </h1>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow p-12 w-full mx-auto">
          <label className="font-semibold">Pilih Level</label>
          <select
            className="border p-3 w-full rounded mt-1"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setNama("");
            }}
          >
            <option value="">Pilih Level</option>
            {kategoriData.map((a) => (
              <option key={a.id} value={a.nama}>
                {a.nama}
              </option>
            ))}
          </select>

          {level && (
            <>
              <label className="font-semibold mt-4 block">Pilih Nama</label>
              <select
                className="border p-3 w-full rounded mt-1"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              >
                <option value="">Pilih Nama</option>
                {filteredNama.map((a) => (
                  <option key={a.id} value={a.nama}>
                    {a.nama}
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            className="bg-blue-600 text-white px-6 py-2 mt-5 rounded hover:bg-blue-700 w-full"
            onClick={handleSubmit}
          >
            Simpan Presensi
          </button>
        </div>

        {/* TABEL */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Data Presensi</h2>

          <table className="w-full">
            <thead>
              <tr className="bg-emerald-300">
                <th className="p-2">No</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">RFID</th> {/* ✅ TAMBAH KOLOM */}
                <th className="p-2">Tanggal</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-nowrap">Jam Masuk</th>
                <th className="p-2 text-nowrap">Jam Pulang</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {presensiData.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 text-nowrap">{item.nama}</td>
                  <td className="p-2 text-center">{item.kategori}</td>
                  <td className="p-2">{item.rfid}</td> {/* ✅ TAMPILKAN RFID */}
                  <td className="p-2 text-center">{item.tanggal}</td>
                  <td className="p-2 text-center">
                    {item.status || "-"}
                  </td>
                  <td className="p-2 text-center">{item.jam_masuk}</td>
                  <td className="p-2 text-center">
                    {item.jam_pulang || "-"}
                  </td>

                  {/* AKSI */}
                  <td className="p-2 flex gap-2">

                    {/* MASUK */}
                    <button
                      disabled={
                        item.status === "izin" ||
                        (item.jam_masuk !== "-" && item.jam_masuk !== "")
                      }
                      onClick={() => handleMasuk(item)}
                      className={`px-3 py-1 rounded text-white ${
                        item.status === "izin"
                          ? "bg-gray-400 cursor-not-allowed"
                          : item.jam_masuk !== "-"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500"
                      }`}
                    >
                      Masuk
                    </button>

                    {/* PULANG */}
                    <button
                      disabled={
                        item.status === "izin" ||
                        item.jam_masuk === "-" ||
                        item.jam_pulang !== "-"
                      }
                      onClick={() => handlePulang(item)}
                      className={`px-3 py-1 rounded text-white ${
                        item.status === "izin"
                          ? "bg-gray-400 cursor-not-allowed"
                          : item.jam_pulang !== "-"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500"
                      }`}
                    >
                      Pulang
                    </button>

                    {/* HAPUS */}
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>

                  </td>
                </tr>
              ))}

              {presensiData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    Belum ada presensi.
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

export default Presensi;