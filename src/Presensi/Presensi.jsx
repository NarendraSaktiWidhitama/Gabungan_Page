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
      tanggal: new Date().toLocaleDateString("id-ID"),
      jam_masuk: new Date().toLocaleTimeString("id-ID"),
      jam_pulang: "",
    };

    await axios.post("http://localhost:5000/presensi", body);

    Swal.fire({
      icon: "success",
      title: "Presensi Tersimpan!",
      text: `${selected.nama} berhasil presensi.`,
      timer: 2000,
    });

    setLevel("");
    setNama("");

    getPresensi();
  };

const handleEdit = async (item) => {
  if (item.jam_pulang) {
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
            <i className="ri-database-2-fill"></i> Presensi sekolah
          </h1>
        </div>
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

        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Data Presensi</h2>

          <table className="w-full">
            <thead>
              <tr className="bg-emerald-300">
                <th className="p-2">No</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Jam Masuk</th>
                <th className="p-2">Jam Pulang</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {presensiData.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.nama}</td>
                  <td className="p-2 text-center">{item.kategori}</td>
                  <td className="p-2 text-right">{item.tanggal}</td>
                  <td className="p-2 text-center">{item.jam_masuk}</td>
                  <td className="p-2 text-center">
                    {item.jam_pulang || "-"}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(item)}
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
                  <td
                    colSpan="7"
                    className="text-center p-4 text-gray-500"
                  >
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