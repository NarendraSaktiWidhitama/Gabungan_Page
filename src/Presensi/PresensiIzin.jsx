import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function PresensiIzin() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [rfid, setRfid] = useState("");
  const [nama, setNama] = useState("Pengguna");
  const [waktu, setWaktu] = useState("");

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

      const izin = await Swal.fire({
        title: "Masukkan Keterangan Izin",
        input: "text",
        inputPlaceholder: "Contoh: Sakit, Urusan keluarga",
        showCancelButton: true,
      });

      if (!izin.value) return;

      await axios.post("http://localhost:5000/presensi", {
        nama: user.nama,
        kategori: user.kategori,
        rfid: value,
        tanggal: new Date().toLocaleDateString("id-ID"),
        jam_masuk: "-",
        jam_pulang: "-",
        status: "izin",
        keterangan: izin.value,
      });

      Swal.fire("Berhasil!", "Izin telah dicatat.", "success");
      navigate("/RekapPresensi");
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

      <div className="bg-[#1f1f1f] border border-yellow-400 rounded-xl shadow-xl px-10 py-8 w-[550px] text-white">
        <h1 className="text-center text-3xl font-bold tracking-wider">
          PRESENSI <span className="text-yellow-300">IZIN</span>
        </h1>

        <h2 className="text-center mt-3 text-xl font-semibold">SCAN UNTUK IZIN</h2>

        <p className="text-center text-4xl font-bold mt-4 text-yellow-300">
          {waktu}
        </p>

        <div className="flex justify-center mt-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Scan RFID..."
            className="px-4 py-2 w-64 rounded-md bg-transparent border border-yellow-400 text-center"
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

export default PresensiIzin;