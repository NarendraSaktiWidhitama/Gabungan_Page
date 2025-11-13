import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Awalan/Login";
import Register from "./Awalan/Register";
import Dashboard from "./componen/Dashboard";
import Kategoridata from "../componen2/Kategoridata";
import Tagihan from "./componen/Tagihan"
import Jenistagihan from "./componen/Jenistagihan";
import Tambahdata from "./componen/Tambahdata";
import Tambahkategori from "../componen2/Tambahkategori";
import Editdata from "./componen/Editdata";
import Editkategori from "../componen2/Editkategori";
import Rekaptagihan from "./componen/Rekaptagihan"
import Masterdata from "../componen2/Masterdata";
import Kelas from "../componen2/Kelas";
import Sidnav from "./componen/Sidnav";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Kategoridata" element={<Kategoridata />} />
      <Route path="/tagihan" element={<Tagihan />} />
      <Route path="/Jenistagihan" element={<Jenistagihan />} />
      <Route path="/Rekaptagihan" element={<Rekaptagihan />} />
      <Route path="/tambahdata" element={<Tambahdata />} />
      <Route path="/tambahkategori" element={<Tambahkategori />} />
      <Route path="/Kelas" element={<Kelas />} />
      <Route path="/Masterdata" element={<Masterdata />} />
      <Route path="/edit/:id" element={<Editdata />} />
      <Route path="/editkategori/:id" element={<Editkategori />} />
    </Routes>
  );
}

export default App;
