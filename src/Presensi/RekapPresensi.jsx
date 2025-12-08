import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "../componen/Sidnav";

function RekapPresensi() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("harian");

  useEffect(() => {
    getData();
  }, [filter]);

  const getData = async () => {
    const res = await axios.get("http://localhost:5000/presensi");
    const all = res.data;

    const today = new Date();
    
    const filtered = all.filter((item) => {
      const tgl = new Date(
        item.tanggal.split("/")[2],
        item.tanggal.split("/")[1] - 1,
        item.tanggal.split("/")[0]
      );

      if (filter === "harian") {
        return (
          tgl.getDate() === today.getDate() &&
          tgl.getMonth() === today.getMonth() &&
          tgl.getFullYear() === today.getFullYear()
        );
      }

      if (filter === "mingguan") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        return tgl >= oneWeekAgo && tgl <= today;
      }

      if (filter === "bulanan") {
        return (
          tgl.getMonth() === today.getMonth() &&
          tgl.getFullYear() === today.getFullYear()
        );
      }

      return true;
    });

    setData(filtered);
  };

  return (
    <div className="flex">
      <Sidnav />

      <div className="ml-58 p-6 w-full">
        <div className="flex justify-between items-center bg-gradient-to-r from-emerald-300 to-emerald-400 px-5 py-4 rounded-md shadow mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <i className="ri-database-2-fill"></i> Rekap Presensi
          </h1>
        </div>
        <div className="rounded-xl mb-5 max-w-xs">
          <label className="font-semibold">Filter Presensi</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-3 w-full rounded mt-1"
          >
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl shadow overflow-auto">
          <table className="w-full border-collapse">
            <thead>
  <tr className="bg-emerald-300">
    <th className="p-2">No</th>
    <th className="p-2">Nama</th>
    <th className="p-2">Kategori</th>
    <th className="p-2">RFID</th> {/* ✅ TAMBAH KOLOM */}
    <th className="p-2">Tanggal</th>
    <th className="p-2">Status</th>
    <th className="p-2">Jam Masuk</th>
    <th className="p-2">Jam Pulang</th>
  </tr>
</thead>
<tbody>
  {data.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center p-4">
        Tidak ada presensi ditemukan.
      </td>
    </tr>
  ) : (
    data.map((item, i) => (
      <tr key={item.id} className="text-center">
        <td className="p-2">{i + 1}</td>
        <td className="p-2 text-left">{item.nama}</td>
        <td className="p-2">{item.kategori}</td>
        <td className="p-2">{item.rfid}</td> {/* ✅ TAMPILKAN RFID */}
        <td className="p-2">{item.tanggal}</td>
        <td className="p-2">
          {item.status || "-"} {/* ⬅️ Tambahan */}
        </td>
        <td className="p-2">{item.jam_masuk}</td>
        <td className="p-2">{item.jam_pulang || "-"}</td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RekapPresensi;