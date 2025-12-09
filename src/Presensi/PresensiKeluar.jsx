import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PresensiKeluar() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [rfid, setRfid] = useState("");
  const [nama, setNama] = useState("Pengguna");
  const [waktu, setWaktu] = useState("");

  // JAM
  useEffect(() => {
    const timer = setInterval(() => {
      setWaktu(new Date().toLocaleTimeString("id-ID"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleScan = async (e) => {
    const value = e.target.value;
    setRfid(value);

    if (value.length >= 10) {
      const res = await axios.get(`http://localhost:5000/masterdata?rfid=${value}`);

      if (res.data.length === 0) {
        alert("RFID Tidak Ditemukan!");
        return;
      }

      const user = res.data[0];
      setNama(user.nama);

      const today = new Date().toLocaleDateString("id-ID");

      // cari presensi hari ini
      const presensi = await axios.get(
        `http://localhost:5000/presensi?rfid=${value}&tanggal=${today}`
      );

      if (presensi.data.length === 0) {
        alert("Belum presensi masuk!");
        return;
      }

      const data = presensi.data[0];

      if (data.jam_pulang !== "-" && data.jam_pulang !== "") {
        alert("Sudah presensi pulang!");
        return;
      }

      // catat pulang
      const jamPulang = new Date().toLocaleTimeString("id-ID");

      await axios.patch(`http://localhost:5000/presensi/${data.id}`, {
        jam_pulang: jamPulang,
      });

      alert("Presensi Pulang Berhasil!");
      navigate("/Presensi");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black bg-opacity-70">
      <div className="w-96 h-96 bg-white rounded-xl shadow-lg flex items-center justify-center mr-10">
        <img
          src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
          alt="User"
          className="w-48 opacity-80"
        />
      </div>

      <div className="bg-[#1f1f1f] border border-red-400 rounded-xl shadow-xl px-10 py-8 w-[550px] text-white">
        <h1 className="text-center text-3xl font-bold tracking-wider">
          PRESENSI <span className="text-red-400">PULANG</span>
        </h1>

        <h2 className="text-center mt-3 text-xl font-semibold">
          SCAN UNTUK PULANG
        </h2>

        <p className="text-center text-4xl font-bold mt-4 text-red-400">
          {waktu}
        </p>

        <div className="flex justify-center mt-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Scan RFID..."
            className="px-4 py-2 w-64 rounded-md bg-transparent border border-red-400 text-center"
            value={rfid}
            onChange={handleScan}
          />
        </div>

        <p className="text-center mt-6 text-gray-300">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="text-center text-xl mt-2 font-semibold">{nama}</p>
      </div>
    </div>
  );
}

export default PresensiKeluar;