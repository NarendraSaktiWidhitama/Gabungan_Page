import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PresensiMasuk() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [rfid, setRfid] = useState("");
  const [nama, setNama] = useState("");
  const [waktu, setWaktu] = useState("");

  useEffect(() => {
    // auto fokus ke input RFID
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleScan = async (e) => {
    const value = e.target.value;
    setRfid(value);

    // misal kalau RFID 10 digit, auto proses
    if (value.length >= 10) {
      const now = new Date().toLocaleString("id-ID");
      setWaktu(now);

      // GET User berdasarkan RFID
      const res = await axios.get(`http://localhost:5000/karyawan?rfid=${value}`);

      if (res.data.length > 0) {
        setNama(res.data[0].nama);

        // simpan ke database
        await axios.post("http://localhost:5000/presensiMasuk", {
          rfid: value,
          nama: res.data[0].nama,
          waktu: now,
          status: "Masuk",
        });

        alert("Presensi Masuk Berhasil!");
        navigate("/Presensi");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Presensi Masuk (Scan RFID)</h2>

      <div className="flex flex-col w-80 gap-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Tempelkan Kartu RFID…"
          className="border p-2 rounded"
          value={rfid}
          onChange={handleScan}
        />

        <input
          type="text"
          className="border p-2 rounded bg-gray-200"
          value={nama}
          readOnly
        />

        <input
          type="text"
          className="border p-2 rounded bg-gray-200"
          value={waktu}
          readOnly
        />
      </div>
    </div>
  );
}

export default PresensiMasuk;