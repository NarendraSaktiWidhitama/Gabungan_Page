import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "../componen/Sidnav";

function RekapPresensi() {
  const [data, setData] = useState([]);
  const [tanggal, setTanggal] = useState("");

  const fetchData = () => {
    axios.get("http://localhost:5000/presensi").then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePulang = async (id) => {
    const jamPulang = new Date().toLocaleTimeString();

    await axios.patch(`http://localhost:5000/presensi/${id}`, {
      jam_pulang: jamPulang,
    });

    fetchData();
  };

  const filtered = tanggal
    ? data.filter((a) => a.tanggal === tanggal)
    : data;

  return (
    <div className="flex">
      <Sidnav />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Rekap Presensi</h1>

        <div className="bg-white border shadow rounded-xl p-5 mb-4">
          <input
            type="text"
            className="border p-3 rounded w-full"
            placeholder="Filter tanggal (contoh: 1/12/2025)"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center bg-white shadow rounded-xl">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="p-2">Nama</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Jam Masuk</th>
                <th className="p-2">Jam Pulang</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-2">{a.nama}</td>
                  <td className="p-2">{a.category}</td>
                  <td className="p-2">{a.tanggal}</td>
                  <td className="p-2">{a.jam_masuk}</td>
                  <td className="p-2">
                    {a.jam_pulang || "-"}
                  </td>
                  <td className="p-2">
                    {!a.jam_pulang && (
                      <button
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        onClick={() => handlePulang(a.id)}
                      >
                        Set Pulang
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default RekapPresensi;