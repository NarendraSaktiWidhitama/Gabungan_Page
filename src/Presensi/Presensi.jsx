import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../componen/Sidnav";

function Presensi() {
  const [level, setLevel] = useState("");
  const [nama, setNama] = useState("");

  const [kategoriData, setKategoriData] = useState([]);
  const [masterData, setMasterData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/kategori").then((res) => {
      setKategoriData(res.data);
    });

    axios.get("http://localhost:5000/masterdata").then((res) => {
      setMasterData(res.data);
    });
  }, []);

  // Filter nama berdasarkan level
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
  };

  return (
    <div className="flex">
      <Sidnav />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-5">Presensi</h1>

        <div className="bg-white rounded-xl shadow p-6 border w-full max-w-xl">

          {/* LEVEL */}
          <label className="font-semibold">Pilih Level</label>
          <select
            className="border p-3 w-full rounded mt-1"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setNama("");
            }}
          >
            <option value="">-- Pilih Level --</option>
            {kategoriData.map((a) => (
              <option key={a.id} value={a.nama}>
                {a.nama}
              </option>
            ))}
          </select>

          {/* NAMA */}
          {level && (
            <>
              <label className="font-semibold mt-4 block">Pilih Nama</label>
              <select
                className="border p-3 w-full rounded mt-1"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              >
                <option value="">-- Pilih Nama --</option>
                {filteredNama.map((a) => (
                  <option key={a.id} value={a.nama}>
                    {a.nama}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Button */}
          <button
            className="bg-blue-600 text-white px-6 py-2 mt-5 rounded hover:bg-blue-700 w-full"
            onClick={handleSubmit}
          >
            Simpan Presensi
          </button>
        </div>
      </div>
    </div>
  );
}

export default Presensi;