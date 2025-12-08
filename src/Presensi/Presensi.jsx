import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../componen/Sidnav";

function Presensi() {
  const [masterData, setMasterData] = useState([]);
  const [presensiData, setPresensiData] = useState([]);
  const [filter, setFilter] = useState("masuk"); // 🔥 FILTER BARU

  useEffect(() => {
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

  // ============================
  // 🔥 FILTER DATA PRESENSI
  // ============================
  const filteredData = presensiData.filter((item) => {
    if (filter === "masuk") return true; // tampilkan semua (default)
    if (filter === "izin") return item.status === "izin";
    if (filter === "pulang")
      return item.jam_pulang !== "-" && item.jam_pulang !== "";
    return true;
  });

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
        keterangan: "-",
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
        keterangan: ket.value,
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

      <div className="flex-1 p-8 ml-54 transition-all">
        <div className="flex justify-between items-center bg-gradient-to-r from-emerald-300 to-emerald-400 px-5 py-4 rounded-md shadow mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <i className="ri-database-2-fill"></i> Presensi Sekolah
          </h1>
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          
          <div className="flex gap-3 mb-6">

  <button
    onClick={() => window.location.href = "/presensi-masuk"}
    className="px-4 py-2 rounded bg-emerald-500 text-white border border-emerald-500 font-medium hover:bg-emerald-600"
  >
    Presensi Masuk
  </button>

  <button
    onClick={() => window.location.href = "/presensi-izin"}
    className="px-4 py-2 rounded bg-yellow-500 text-white border border-yellow-500 font-medium hover:bg-yellow-600"
  >
    Presensi Izin
  </button>

  <button
    onClick={() => window.location.href = "/presensi-pulang"}
    className="px-4 py-2 rounded bg-red-500 text-white border border-red-500 font-medium hover:bg-red-600"
  >
    Presensi Pulang
  </button>

</div>


          <h2 className="text-xl font-bold mb-4">Data Presensi</h2>

          <table className="w-full">
            <thead>
              <tr className="bg-emerald-300">
                <th className="p-2">No</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">RFID</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Status</th>
                <th className="p-2">Jam Masuk</th>
                <th className="p-2">Jam Pulang</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 text-nowrap">{item.nama}</td>
                  <td className="p-2 text-center">{item.kategori}</td>
                  <td className="p-2">{item.rfid}</td>
                  <td className="p-2 text-center">{item.tanggal}</td>
                  <td className="p-2 text-center">{item.status || "-"}</td>
                  <td className="p-2 text-center">{item.jam_masuk}</td>
                  <td className="p-2 text-center">{item.jam_pulang || "-"}</td>

                  <td className="p-2 flex gap-2">
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
                  <td colSpan="9" className="text-center p-4 text-gray-500">
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