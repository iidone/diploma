"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type ModalMode = "login" | "register";

export const AuthButton = () => {
  const { user, login, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPatronymic, setRegPatronymic] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка авторизации");
      }

      const data = await response.json();
      login(data.access_token, data.user_info);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/v1/users/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          first_name: regFirstName,
          last_name: regLastName,
          patronymic: regPatronymic || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка регистрации");
      }

      setSuccessMessage("Аккаунт успешно создан! Теперь вы можете войти.");
      setModalMode("login");
      setEmail(regEmail);
      setPassword(regPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRegEmail("");
    setRegPassword("");
    setRegFirstName("");
    setRegLastName("");
    setRegPatronymic("");
    setError("");
    setSuccessMessage("");
  };

  const handleClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (user) {
    return (
      <div className="flex items-center gap-2 ml-4">
        <span className="text-slate-300 text-sm">
          {user.first_name} {user.last_name}
        </span>
        <button
          onClick={() => logout()}
          className="bg-slate-600 cursor-pointer hover:text-slate-300 hover:bg-slate-700 transition-colors duration-300 px-4 py-2 rounded-lg"
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-slate-600 ml-4 cursor-pointer hover:text-slate-300 hover:bg-slate-700 transition-colors duration-300 px-4 py-2 rounded-lg"
      >
        Войти
      </div>

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
          isModalOpen
            ? "bg-black/30 backdrop-blur-sm opacity-100"
            : "bg-black/0 backdrop-blur-none pointer-events-none opacity-0"
        }`}
        onClick={handleClose}
      >
        <div
          className={`bg-gray-100 p-6 rounded-xl w-96 shadow-2xl transition-all duration-300 ${
            isModalOpen
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {modalMode === "login" ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Вход
              </h2>
              <form onSubmit={handleLogin}>
                <div className="mb-5">
                  <label className="block text-gray-600 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-600 mb-2 font-medium">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                {error && (
                  <p className="text-red-500 mb-4 text-center font-medium">
                    {error}
                  </p>
                )}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Вход..." : "Войти"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Отмена
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setModalMode("register")}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer text-sm underline"
                  >
                    Нет аккаунта? Зарегистрируйтесь
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Регистрация
              </h2>
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 font-medium">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 font-medium">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 font-medium">
                    Отчество (необязательно)
                  </label>
                  <input
                    type="text"
                    value={regPatronymic}
                    onChange={(e) => setRegPatronymic(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-600 mb-2 font-medium">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                {error && (
                  <p className="text-red-500 mb-4 text-center font-medium">
                    {error}
                  </p>
                )}
                {successMessage && (
                  <p className="text-green-600 mb-4 text-center font-medium">
                    {successMessage}
                  </p>
                )}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode("login")}
                    className="flex-1 cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Назад
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};
