import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "../componen/Sidnav";

function PresensiIzin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/presensi").then((res) => {
      const filtered = res.data.filter((item) => item.status === "izin");
      setData(filtered);
    });
  }, []);

  return (
    <div className="flex bg-gray-100">
      <Sidnav />

      <div className="flex-1 p-8 ml-54">
        <div className="bg-yellow-400 text-white px-5 py-4 rounded-md shadow mb-6">
          <h1 className="text-2xl font-semibold">Presensi Izin</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-yellow-300">
                <th className="p-2">No</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">RFID</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={item.id}>
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{item.nama}</td>
                  <td className="p-2 text-center">{item.kategori}</td>
                  <td className="p-2">{item.rfid}</td>
                  <td className="p-2 text-center">{item.tanggal}</td>
                  <td className="p-2 text-center">{item.keterangan}</td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    Tidak ada data izin.
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

export default PresensiIzin;