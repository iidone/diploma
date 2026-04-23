"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Plus, Trash2, Edit3, Save, 
  MessageSquare, Users, Settings, Package, 
  Info, DollarSign, FileText, AlertCircle,
  ChevronDown, ChevronUp
} from "lucide-react";

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
  category: "rules" | "prices" | "services" | "info";
  isExpanded?: boolean;
}

type TabType = "users" | "bot";

export default function AdminPanel() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [blocks, setBlocks] = useState<BotBlock[]>([]);
  const [botLoading, setBotLoading] = useState(false);
  const [botError, setBotError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [newBlockCategory, setNewBlockCategory] = useState<BotBlock["category"]>("rules");
  const [newBlockType, setNewBlockType] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchUsers();
    loadBotConfig();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Ошибка загрузки пользователей");
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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
        const blocksWithId = data.blocks.map((b: any, index: number) => ({
          id: index.toString(),
          type: b.type,
          content: b.content,
          category: getCategoryFromType(b.type),
          isExpanded: false
        }));
        setBlocks(blocksWithId);
      }
    } catch (err) {
      setBotError("Не удалось загрузить конфигурацию");
    }
  };

  const getCategoryFromType = (type: string): BotBlock["category"] => {
    const typeMap: Record<string, BotBlock["category"]> = {
      "rules": "rules",
      "prices": "prices",
      "services": "services",
      "info": "info"
    };
    return typeMap[type] || "rules";
  };

  const saveBotConfig = async () => {
    if (!token) return;
    setBotLoading(true);
    setSaveSuccess(false);
    try {
      const response = await fetch("/api/v1/admin/bot-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          blocks: blocks.map(({ id, isExpanded, ...block }) => block)
        }),
      });
      if (!response.ok) throw new Error("Ошибка сохранения");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setBotError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setBotLoading(false);
    }
  };

  const addBlock = () => {
    if (!newBlockType.trim()) {
      setBotError("Введите название правила/услуги");
      return;
    }
    
    const id = Date.now().toString();
    const newBlock: BotBlock = {
      id,
      type: newBlockType,
      content: "",
      category: newBlockCategory,
      isExpanded: true
    };
    setBlocks([...blocks, newBlock]);
    setNewBlockType("");
    setShowAddForm(false);
    setEditingId(id);
    setEditContent("");
  };

  const deleteBlock = (id: string) => {
    setDeleteModalOpen(true);
    setBlockToDelete(id);
  };

  const confirmDelete = () => {
    if (blockToDelete) {
      setBlocks(blocks.filter(b => b.id !== blockToDelete));
    }
    setDeleteModalOpen(false);
    setBlockToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setBlockToDelete(null);
  };

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const saveEdit = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: editContent, isExpanded: false } : b));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const toggleExpand = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, isExpanded: !b.isExpanded } : b));
  };

  const getCategoryIcon = (category: BotBlock["category"]) => {
    switch (category) {
      case "rules": return <AlertCircle size={18} className="text-purple-500" />;
      case "prices": return <DollarSign size={18} className="text-green-500" />;
      case "services": return <Package size={18} className="text-blue-500" />;
      case "info": return <Info size={18} className="text-orange-500" />;
      default: return <FileText size={18} />;
    }
  };

  const getCategoryTitle = (category: BotBlock["category"]) => {
    switch (category) {
      case "rules": return "Правила поведения";
      case "prices": return "Цены и прайсы";
      case "services": return "Услуги и товары";
      case "info": return "Информация о компании";
      default: return "Другое";
    }
  };

  const groupedBlocks = blocks.reduce((acc, block) => {
    if (!acc[block.category]) acc[block.category] = [];
    acc[block.category].push(block);
    return acc;
  }, {} as Record<BotBlock["category"], BotBlock[]>);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 select-none">
                <Settings size={32} />
                Панель администратора
              </h1>
              <p className="text-slate-300 mt-2 select-none">Управление пользователями и настройка чат-бота</p>
            </div>
            
            <div className="flex border-b border-gray-200 bg-white">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-6 py-4 font-medium transition-all duration-200 flex items-center gap-2 select-none cursor-pointer ${
                  activeTab === "users"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Users size={20} />
                Пользователи
              </button>
              <button
                onClick={() => setActiveTab("bot")}
                className={`px-6 py-4 font-medium transition-all duration-200 flex items-center gap-2 select-none cursor-pointer ${
                  activeTab === "bot"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <MessageSquare size={20} />
                Конфигуратор чат-бота
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {saveSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6">
              ✓ Конфигурация успешно сохранена!
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {loading ? (
                <div className="text-center py-12 select-none">Загрузка...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">Пользователь</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">Роль</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 select-none">
                              {u.first_name} {u.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 select-none">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium select-none ${
                              u.role === 'admin' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handlePromote(u.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer select-none"
                              >
                                Сделать админом
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer select-none"
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
          )}

          {activeTab === "bot" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 select-none">Настройка базы знаний чат-бота</h2>
                    <p className="text-sm text-gray-500 mt-1 select-none">
                      Добавляйте правила, цены, услуги и информацию для обучения ИИ-ассистента
                    </p>
                  </div>
                  <button
                    onClick={saveBotConfig}
                    disabled={botLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg cursor-pointer select-none"
                  >
                    <Save size={18} />
                    {botLoading ? "Сохранение..." : "Сохранить все изменения"}
                  </button>
                </div>

                {botError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {botError}
                  </div>
                )}

                {!showAddForm ? (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mb-6 shadow-md cursor-pointer select-none"
                  >
                    <Plus size={20} />
                    Добавить новое правило/услугу/цену
                  </button>
                ) : (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-4 flex-wrap">
                      <select
                        value={newBlockCategory}
                        onChange={(e) => setNewBlockCategory(e.target.value as BotBlock["category"])}
                        className="px-4 py-2 text-gray-700 select-none cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="rules">📋 Правила</option>
                        <option value="prices">💰 Цены</option>
                        <option value="services">📦 Услуги</option>
                        <option value="info">ℹ️ Информация</option>
                      </select>
                      <input
                        type="text"
                        value={newBlockType}
                        onChange={(e) => setNewBlockType(e.target.value)}
                        placeholder="Название (например: Цены на баннеры)"
                        className="flex-1 text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent select-none"
                      />
                      <button
                        onClick={addBlock}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer select-none"
                      >
                        Добавить
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer select-none"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                {Object.entries(groupedBlocks).map(([category, categoryBlocks]) => (
                  <div key={category} className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2 select-none">
                        {getCategoryIcon(category as BotBlock["category"])}
                        {getCategoryTitle(category as BotBlock["category"])}
                        <span className="text-sm text-gray-500 ml-2">({categoryBlocks.length})</span>
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {categoryBlocks.map((block) => (
                        <div key={block.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <button
                                onClick={() => toggleExpand(block.id)}
                                className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer select-none"
                              >
                                {block.isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                <h4 className="font-medium text-gray-900">{block.type}</h4>
                              </button>
                              
                              {block.isExpanded && (
                                <div className="mt-3 ml-6">
                                  {editingId === block.id ? (
                                    <div className="space-y-2">
                                      <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] font-mono text-sm"
                                        placeholder="Введите содержание..."
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => saveEdit(block.id)}
                                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm transition-colors flex items-center gap-1 cursor-pointer select-none"
                                        >
                                          <Save size={14} />
                                          Сохранить
                                        </button>
                                        <button
                                          onClick={cancelEdit}
                                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded text-sm transition-colors cursor-pointer select-none"
                                        >
                                          Отмена
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-gray-100 rounded-lg p-3">
                                      <div className="whitespace-pre-wrap text-sm text-gray-700 min-h-[50px] select-none">
                                        {block.content || <span className="text-gray-400 italic">Нет содержания. Нажмите редактировать для добавления.</span>}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1 ml-4">
                              {!editingId && (
                                <button
                                  onClick={() => startEdit(block.id, block.content)}
                                  className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer select-none"
                                  title="Редактировать"
                                >
                                  <Edit3 size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteBlock(block.id)}
                                className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors cursor-pointer select-none"
                                title="Удалить"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {blocks.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                    <p className="text-yellow-800 select-none">Нет настроенных блоков. Нажмите "Добавить" чтобы начать.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {deleteModalOpen && blockToDelete && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={cancelDelete}>
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-xl flex-shrink-0">
                <Trash2 size={28} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-1 select-none">Удалить блок?</h2>
                <p className="text-gray-600 text-sm select-none">Блок "{blocks.find(b => b.id === blockToDelete)?.type}" будет удален.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer select-none">
                Удалить
              </button>
              <button onClick={cancelDelete} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium transition-colors cursor-pointer select-none">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}