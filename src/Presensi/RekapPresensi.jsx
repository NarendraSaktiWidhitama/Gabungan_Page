import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "../componen/Sidnav";
import Swal from "sweetalert2";

function RekapPresensi() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("harian");

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    getData();
  }, [filter]);

  const getData = async () => {
    const res = await axios.get("http://localhost:5000/presensi");
    const all = res.data;

    const today = new Date();

    const filtered = all.filter((item) => {
      if (!item.tanggal) return false;
      const [dd, mm, yyyy] = item.tanggal.split("/");
      const tgl = new Date(yyyy, mm - 1, dd);

      if (filter === "harian")
        return (
          tgl.getDate() === today.getDate() &&
          tgl.getMonth() === today.getMonth() &&
          tgl.getFullYear() === today.getFullYear()
        );

      if (filter === "mingguan") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        return tgl >= oneWeekAgo && tgl <= today;
      }

      if (filter === "bulanan")
        return (
          tgl.getMonth() === today.getMonth() &&
          tgl.getFullYear() === today.getFullYear()
        );

      return true;
    });

    setData(filtered);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus presensi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`http://localhost:5000/presensi/${id}`);
    getData();
    Swal.fire("Berhasil", "Presensi dihapus", "success");
  };

  const handleUpdate = async () => {
    await axios.put(
      `http://localhost:5000/presensi/${editData.id}`,
      editData
    );
    setShowEdit(false);
    getData();
    Swal.fire("Berhasil", "Presensi diperbarui", "success");
  };

  return (
    <div className="flex">
      <Sidnav />

      <div className="ml-58 p-6 w-full">
        <div className="bg-gradient-to-r from-emerald-300 to-emerald-400 px-5 py-4 rounded-md shadow mb-6">
          <h1 className="text-2xl font-bold">Rekap Presensi</h1>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-3 rounded mb-4"
        >
          <option value="harian">Harian</option>
          <option value="mingguan">Mingguan</option>
          <option value="bulanan">Bulanan</option>
        </select>

        <div className="bg-white p-4 rounded-xl shadow overflow-auto">
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
              {data.map((item, i) => (
                <tr key={item.id} className="text-center">
                  <td>{i + 1}</td>
                  <td className="text-left">{item.nama}</td>
                  <td>{item.kategori}</td>
                  <td>{item.rfid}</td>
                  <td>{item.tanggal}</td>
                  <td>{item.status}</td>
                  <td>{item.jam_masuk}</td>
                  <td>{item.jam_pulang || "-"}</td>
                  <td className="p-2 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                      onClick={() => {
                        setEditData(item);
                        setShowEdit(true);
                      }}
                      className="bg-yellow-400 px-3 py-1 rounded text-white"
                      >
                        ✏️
                        </button>
                        <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 px-3 py-1 rounded text-white"
                        >
                          🗑️
                          </button>
                          </div>
                          </td>
                          </tr>
                        ))}
                        </tbody>
                        </table>
                        </div>

        {showEdit && editData && (
  <div className="fixed inset-0 bg-gray-200 bg-opacity-30 flex justify-center items-center z-50">
    <Sidnav />
    <div className="bg-white rounded-xl shadow-2xl w-[450px] h-[350px] flex flex-col px-6 ml-50">
      
      <h2 className="text-xl font-bold text-center mt-6">
        Edit Presensi
      </h2>

      <div className="flex-1 flex flex-col justify-center gap-4">
        
        <select
          value={editData.status}
          onChange={(e) =>
            setEditData({ ...editData, status: e.target.value })
          }
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="hadir">Hadir</option>
          <option value="izin">Izin</option>
        </select>

        <input
          value={editData.jam_masuk}
          onChange={(e) =>
            setEditData({ ...editData, jam_masuk: e.target.value })
          }
          placeholder="Jam Masuk"
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <input
          value={editData.jam_pulang}
          onChange={(e) =>
            setEditData({ ...editData, jam_pulang: e.target.value })
          }
          placeholder="Jam Pulang"
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleUpdate}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg w-full font-semibold"
        >
          Simpan
        </button>
        <button
          onClick={() => setShowEdit(false)}
          className="bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg w-full font-semibold"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
)}
</div>
</div>
  );
}

export default RekapPresensi;