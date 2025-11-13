import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import 'remixicon/fonts/remixicon.css';
import Logo from "../assets/Logo.png"

const Sidnav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin Keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar!",
    });

    if (result.isConfirmed) navigate("/");
  };

  const linkClass = (path) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all ${
      isActive(path)
        ? "bg-emerald-300 text-black font-semibold shadow-sm"
        : "text-gray-800 hover:bg-emerald-300 hover:text-black"
    }`;

  return (
    <div className="fixed top-0 left-0 h-full w-56 bg-white shadow-lg text-gray-700 flex flex-col border-r border-gray-200">

      <div className="flex items-center gap-3 py-5 pl-6">
        <img src={Logo} alt="Logo" className="w-10" />
        <h1 className="text-lg font-black tracking-wide text-gray-800">DATABASE</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3 mt-3 space-y-5">

        <div>
          <p className="text-xs font-bold text-gray-700 mb-1 px-2 uppercase">
            Dashboard
          </p>
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <i className="ri-dashboard-fill"></i> Dashboard
          </Link>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-700 mb-1 px-2 uppercase">
            Database
          </p>
          <Link to="/Kategoridata" className={linkClass("/Kategoridata")}>
            <i className="ri-folder-user-fill"></i> Kategori Data
          </Link>
          <Link to="/Kelas" className={linkClass("/Kelas")}>
            <i className="ri-group-fill"></i> Kelas
          </Link>
          <Link to="/Masterdata" className={linkClass("/Masterdata")}>
            <i className="ri-database-2-fill"></i> Master Data
          </Link>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-700 mb-1 px-2 uppercase">
            Keuangan
          </p>
          <Link to="/Jenistagihan" className={linkClass("/Jenistagihan")}>
            <i className="ri-price-tag-3-fill"></i> Kategori Tagihan
          </Link>
          <Link to="/tagihan" className={linkClass("/tagihan")}>
            <i className="ri-file-list-3-fill"></i> Tagihan
          </Link>
          <Link to="/Rekaptagihan" className={linkClass("/Rekaptagihan")}>
            <i className="ri-history-fill"></i> Rekap Tagihan
          </Link>
        </div>

      </div>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md font-bold flex items-center justify-center gap-2 text-white"
        >
          <i className="ri-logout-box-line"></i> Keluar
        </button>
      </div>
    </div>
  );
};

export default Sidnav;