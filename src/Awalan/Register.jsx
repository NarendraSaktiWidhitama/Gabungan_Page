import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import myvideo from "../assets/Zz.mp4";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      Swal.fire({ icon: "error", title: "Password tidak cocok" });
      return;
    }
    try {
      const check = await axios.get("http://localhost:5000/users", { params: { username: form.username } });
      if (check.data.length > 0) {
        Swal.fire({ icon: "error", title: "Username sudah dipakai" });
        return;
      }
      await axios.post("http://localhost:5000/users", { username: form.username, password: form.password });
      Swal.fire({ icon: "success", title: "Berhasil daftar", timer: 1200, showConfirmButton: false });
      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Gagal mendaftar" });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative">
      <div className="absolute inset-0 z-0">
        <video
          src={myvideo}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        ></video>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-10 w-96 z-10">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="border rounded-lg px-4 py-2"
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border rounded-lg px-4 py-2 w-full pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="relative">
            <input
              name="confirm"
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={handleChange}
              placeholder="Konfirmasi Password"
              className="border rounded-lg px-4 py-2 w-full pr-10"
              required
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-600 cursor-pointer"
            >
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            Register
          </button>

          <p className="text-center text-sm">
            Sudah punya akun?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;