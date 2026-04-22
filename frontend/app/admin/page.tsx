"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit3 } from "lucide-react";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface BotBlock {
  id: string;
  type: string;
  content: string;
}

export default function AdminPanel() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBotConfig, setShowBotConfig] = useState(false);
  const [blocks, setBlocks] = useState<BotBlock[]>([]);
  const [newBlockType, setNewBlockType] = useState("prices");
  const [botLoading, setBotLoading] = useState(false);
  const [botError, setBotError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUsers();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push("/");
          return;
        }
        throw new Error("Ошибка загрузки пользователей");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId: number) => {
    try {
      const response = await fetch(`/api/v1/admin/users/${userId}/promote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Ошибка повышения");
      fetchUsers(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Удалить пользователя?")) return;
    try {
      const response = await fetch(`/api/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Ошибка удаления");
      fetchUsers(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    }
  };

  const loadBotConfig = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/v1/admin/bot-config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const blocksWithId = data.blocks.map((b: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: b.type,
          content: b.content
        }));
        setBlocks(blocksWithId);
      }
    } catch (err) {
      setBotError("Не удалось загрузить конфигурацию");
    }
  };

  const saveBotConfig = async () => {
    if (!token) return;
    setBotLoading(true);
    try {
      const response = await fetch("/api/v1/admin/bot-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blocks }),
      });
      if (!response.ok) throw new Error("Ошибка сохранения");
      alert("Конфигурация сохранена!");
    } catch (err) {
      setBotError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setBotLoading(false);
    }
  };

  const addBlock = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setBlocks([...blocks, { id, type: newBlockType, content: "" }]);
    setNewBlockType("prices");
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const saveEdit = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: editContent } : b));
    setEditingId(null);
  };

  if (!user || user.role !== "admin") {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Админ панель</h1>
        <div className="mb-8">
          <button
            onClick={() => setShowBotConfig(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg shadow-green-500/25"
          >
            ЧАТ-БОТ
          </button>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Имя</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Роль</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {u.first_name} {u.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {u.role === 'admin' ? 'Админ' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handlePromote(u.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Сделать админом
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showBotConfig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Конфигуратор чат-бота</h1>
              <button onClick={() => setShowBotConfig(false)} className="text-white hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {botError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {botError}
                </div>
              )}
              <div className="space-y-6">
                <div className="flex gap-3">
                  <select 
                    value={newBlockType}
                    onChange={(e) => setNewBlockType(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="prices">Цены</option>
                    <option value="services">Услуги</option>
                    <option value="rules">Правила ответов</option>
                    <option value="info">Информация о компании</option>
                    <option value="custom">Другое</option>
                  </select>
                  <button
                    onClick={addBlock}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Добавить
                  </button>
                </div>
                <div className="space-y-3">
                  {blocks.map((block) => (
                    <div key={block.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-medium text-lg capitalize">{block.type}</div>
                        <div className="flex gap-1">
                          {editingId === block.id ? (
                            <button
                              onClick={() => saveEdit(block.id)}
                              className="text-green-600 hover:text-green-700 p-1 rounded-full hover:bg-green-100"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => startEdit(block.id, block.content)}
                              className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                            >
                              <Edit3 size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteBlock(block.id)}
                            className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      {editingId === block.id ? (
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px]"
                          placeholder="Введите содержание блока..."
                        />
                      ) : (
                        <div className="text-sm leading-relaxed whitespace-pre-wrap min-h-[100px] p-3 border border-gray-200 rounded-lg bg-white">{block.content || "Пустой блок"}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={saveBotConfig}
                disabled={botLoading || blocks.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {botLoading ? "Сохранение..." : "Сохранить конфигурацию"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={loadBotConfig}
                disabled={botLoading}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-all duration-200"
              >
                Загрузить текущую
              </button>
            </div>
          </div>
        </div>
      )}

      {showBotConfig && (
        <button
          onClick={() => setShowBotConfig(false)}
          className="fixed top-6 right-6 z-[51] bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

