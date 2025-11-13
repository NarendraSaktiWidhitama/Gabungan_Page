import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";

function Rekaptagihan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("harian");

  useEffect(() => {
    const load = async () => {
      try {
        const r = await axios.get("http://localhost:5000/data");
        const reversed = [...r.data].reverse();
        setData(reversed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-emerald-500"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">Memuat rekapan</p>
        </div>
      </div>
    );

  const now = new Date();
  const filteredData = data.filter((item) => {
    const t = new Date(item.tanggal);
    if (filter === "harian") return t.toDateString() === now.toDateString();
    if (filter === "mingguan") return t >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    if (filter === "bulanan") return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidnav />
      <div className="flex-1 p-8 ml-56 overflow-x-auto">
        <div className="bg-gradient-to-r from-emerald-300 to-emerald-400 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <i class="ri-folder-history-fill text-3xl"></i>
            <h1 className="text-2xl font-bold">Rekap Data Tagihan</h1>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <label className="font-medium mr-2">Filter Waktu:</label>
          <select
            className="border rounded px-3 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
          </select>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-xl min-w-[900px]">
          <table className="w-full text-[15px] border-collapse">
            <thead className="bg-gradient-to-r from-emerald-300 to-emerald-300">
              <tr>
                <th className="py-2 px-3 w-[40px]">No</th>
                <th className="py-2 px-3 w-[180px]">Nama</th>
                <th className="py-2 px-3 w-[220px]">Email</th>
                <th className="py-2 px-3 w-[130px]">Jenis</th>
                <th className="py-2 px-3 w-[110px]">Jumlah</th>
                <th className="py-2 px-3 w-[110px]">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d, i) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="py-2 px-3 text-right">{i + 1}</td>
                  <td className="py-2 px-3 text-left">{d.nama}</td>
                  <td className="py-2 px-3 text-left">{d.email}</td>
                  <td className="py-2 px-3 text-center">{d.jenis}</td>
                  <td className="py-2 px-3 text-right">Rp {d.jumlah?.toLocaleString()}</td>
                  <td className="py-2 px-3 text-center">
                    {d.tanggal ? new Date(d.tanggal).toLocaleDateString("id-ID") : "-"}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-6 text-gray-500 text-center">
                    Tidak ada data
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

export default Rekaptagihan;
