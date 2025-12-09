import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../componen/Sidnav";

function Presensi() {
  const [presensiData, setPresensiData] = useState([]);

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/848/848006.png";

  useEffect(() => {
    getPresensi();
  }, []);

  const getPresensi = () => {
    axios.get("http://localhost:5000/presensi").then((res) => {
      setPresensiData(res.data);
    });
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
              onClick={() => (window.location.href = "/presensi-masuk")}
              className="px-4 py-2 rounded bg-emerald-500 text-white font-medium hover:bg-emerald-600"
            >
              Presensi Masuk
            </button>

            <button
              onClick={() => (window.location.href = "/presensi-izin")}
              className="px-4 py-2 rounded bg-yellow-500 text-white font-medium hover:bg-yellow-600"
            >
              Presensi Izin
            </button>

            <button
              onClick={() => (window.location.href = "/presensi-keluar")}
              className="px-4 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600"
            >
              Presensi Keluar
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">Data Presensi</h2>

          <table className="w-full">
            <thead>
              <tr className="bg-emerald-300">
                <th className="p-2">No</th>
                <th className="p-2">Foto</th>
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
              {presensiData.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2 text-center">{index + 1}</td>

                  <td className="p-2 text-center">
                    <img
                      src={item.foto ? item.foto : defaultAvatar}
                      className="w-10 h-10 rounded-full object-cover mx-auto"
                    />
                  </td>

                  <td className="p-2">{item.nama}</td>
                  <td className="p-2 text-center">{item.kategori}</td>
                  <td className="p-2 text-center">{item.rfid}</td>
                  <td className="p-2 text-center">{item.tanggal}</td>
                  <td className="p-2 text-center">{item.status}</td>
                  <td className="p-2 text-center">{item.jam_masuk}</td>
                  <td className="p-2 text-center">{item.jam_pulang}</td>

                  <td className="p-2 text-center">
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
                  <td colSpan="10" className="text-center p-4 text-gray-500">
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