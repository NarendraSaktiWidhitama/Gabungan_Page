import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";

const cardAnimationClasses = (index, show) =>
  `transition-all duration-700 ease-out transform ${
    show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  } ${show ? `delay-${index * 150}` : "delay-0"}`;

function Dashboard() {
  const [kategoridata, setKategoridata] = useState([]);
  const [tagihan, setTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [resKategoridata, resTagihan] = await Promise.all([
        axios.get("http://localhost:5000/masterdata"),
        axios.get("http://localhost:5000/data"),
      ]);

      setKategoridata(resKategoridata.data.reverse());
      setTagihan(resTagihan.data.reverse());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setShowContent(true), 50);
    }
  };
  load();
}, []);

  if (loading && !showContent)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-emerald-500"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">Memuat dashboard</p>
        </div>
      </div>
    );

const kategoriOrder = ["Siswa", "Guru", "Karyawan"];
const kategoriCards = kategoriOrder.map(kat => {
  let bgColor = kat === "Siswa" ? "bg-green-500" :
                kat === "Guru" ? "bg-blue-500" :
                "bg-yellow-500";
  let icon = kat === "Siswa" ? "ri-user-line" :
             kat === "Guru" ? "ri-team-line" :
             "ri-user-settings-line";
  return {
    title: `Total ${kat}`,
    value: kategoridata.filter(d => d.kategori === kat).length,
    bgColor,
    icon,
  };
});


const totalTagihan = tagihan.reduce((sum, item) => sum + (item.jumlah || 0), 0);
const sudahBayar = tagihan.filter((d) => d.status === true).length;
const belumBayar = tagihan.filter((d) => !d.status).length;

  const tagihanCards = [
  { 
    title: "Total Tagihan", 
    value: `Rp ${totalTagihan.toLocaleString("id-ID")}`, 
    bgColor: "bg-purple-500", 
    icon: "ri-file-list-3-line" 
  },
  { 
    title: "Sudah Lunas", 
    value: sudahBayar, 
    bgColor: "bg-green-600", 
    icon: "ri-checkbox-circle-line" 
  },
  { 
    title: "Belum Lunas", 
    value: belumBayar, 
    bgColor: "bg-red-600", 
    icon: "ri-close-circle-line" 
  },
];

  const siswaData = kategoridata.filter(d => d.kategori === "Siswa");
  const guruData = kategoridata.filter(d => d.kategori === "Guru");
  const karyawanData = kategoridata.filter(d => d.kategori === "Karyawan");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidnav />
      <div className={`flex-1 p-8 ml-56 transition-all ${showContent ? "opacity-100 translate-y-0 duration-1000" : "opacity-0 translate-y-4"}`}>
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <i className="ri-dashboard-line text-3xl"></i>
          Dashboard Sekolah
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mb-6 gap-y-4">
          {kategoriCards.map((card, index) => (
            <div key={index} className={`${card.bgColor} p-6 rounded-xl shadow-lg text-center hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ${cardAnimationClasses(index, showContent)}`}>
              <div className="flex justify-center mb-2">
                <i className={`${card.icon} text-white text-4xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          {tagihanCards.map((card, index) => (
            <div key={index} className={`${card.bgColor} p-6 rounded-xl shadow-lg text-center hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ${cardAnimationClasses(index + 3, showContent)}`}>
              <div className="flex justify-center mb-2">
                <i className={`${card.icon} text-white text-4xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        <Table title="Tabel Siswa" data={siswaData} headerColor="from-green-300 to-green-400" />
        <Table title="Tabel Guru" data={guruData} headerColor="from-blue-300 to-blue-400" />
        <Table title="Tabel Karyawan" data={karyawanData} headerColor="from-yellow-300 to-yellow-400" />
        <Table title="Tabel Tagihan" data={tagihan} tagihanTable headerColor="from-emerald-300 to-emerald-400" />
      </div>
    </div>
  );
}

function Table({ title, data, tagihanTable, headerColor }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl mb-8 transition-all duration-700 ease-out">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <i className="ri-file-list-3-line text-emerald-600 text-xl"></i>
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse text-base">
          <thead className={`bg-gradient-to-r ${headerColor}`}>
            <tr>
              <th className="py-2 px-3 w-[30px]">No</th>
              <th className="py-2 px-3 text-left">Nama</th>
              {tagihanTable ? (
                <>
                  <th className="py-2 px-3 text-left">Jenis</th>
                  <th className="py-2 px-3 text-left">Jumlah</th>
                  <th className="py-2 px-3">Tanggal</th>
                  <th className="py-2 px-3">Status</th>
                </>
              ) : (
                <>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">Kategori</th>
                  <th className="py-2 px-3 text-left">Jabatan/Kelas</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((d, i) => (
                <tr key={d.id || i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-3">{i + 1}</td>
                  <td className="py-2 px-3 text-left truncate">{d.nama}</td>
                  {tagihanTable ? (
                    <>
                      <td className="py-2 px-3 text-left">{d.jenis}</td>
                      <td className="py-2 px-3 text-left">
                        Rp {d.jumlah?.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {d.tanggal
                          ? new Date(d.tanggal).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            d.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {d.status ? "Lunas" : "Belum Lunas"}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-3 text-left">{d.email}</td>
                      <td className="py-2 px-3 text-left">{d.kategori}</td>
                      <td className="py-2 px-3 text-left">
                        {d.jabatan || d.kelas || "-"}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tagihanTable ? 6 : 5}
                  className="p-4 text-gray-500 text-center"
                >
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;