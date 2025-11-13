import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import myvideo from "../assets/Zz.mp4";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:5000/users", {
        params: { username: form.username, password: form.password },
      });

      if (res.data.length > 0) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil login",
          showConfirmButton: false,
          timer: 1200,
        });
        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Username / password salah",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan server",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
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
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 font-sans">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white/80 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />

          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white/80 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Login
          </button>

          <p className="text-center text-sm">
            Belum punya akun?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
