import { FC, useState, useEffect } from "react";
import $api from "../http"; // для API запросов
import { IUser } from "../models/IUser"; // определение интерфейса пользователя
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../main.tsx"; // контекст с текущим пользователем

const UsersPage: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [newUser, setNewUser] = useState<IUser>({
    id: "",
    email: "",
    name: "",
    surname: "",
    password: "",
    createdAt: "",
    updatedAt: "",
    roles: [],
  });
  const navigate = useNavigate();

  // Проверка роли администратора
  const isAdmin = store.user?.roles?.includes("ADMIN") ?? false;

  // Если пользователь не администратор, перенаправляем его на главную страницу
  useEffect(() => {
    if (!isAdmin) {
      navigate("/"); // Если не админ, редирект на главную
    }
  }, [isAdmin, navigate]);

  // Загрузка всех пользователей
  const loadUsers = async () => {
    try {
      const response = await $api.get<IUser[]>("/user", {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
    }
  };

  // Добавление нового пользователя
  const handleAddUser = async () => {
    try {
      await $api.post("/user/register-user", newUser, {
        withCredentials: true, // Ensures the token is sent with the request
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token to headers
        },
      });
      loadUsers(); // Обновляем список пользователей
      setNewUser({
        id: "",
        email: "",
        name: "",
        surname: "",
        password: "",
        createdAt: "",
        updatedAt: "",
        roles: [],
      });
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };

  // Редактирование пользователя
  const handleEditUser = async () => {
    if (editingUser) {
      try {
        await $api.patch(`/user/update-user/${editingUser.id}`, editingUser, {
          withCredentials: true,
        });
        loadUsers(); // Обновляем список пользователей
        setIsEditing(false);
        setEditingUser(null);
      } catch (error) {
        console.error("Ошибка при редактировании пользователя:", error);
      }
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async (userId: string) => {
    try {
      await $api.delete(`/user/${userId}`, { withCredentials: true });
      loadUsers(); // Обновляем список пользователей
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  // Включение режима редактирования
  const startEditing = (user: IUser) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  // Выключение режима редактирования
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingUser(null);
  };

  // Загружаем пользователей при монтировании компонента
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Список пользователей</h1>

      <div className="mb-4 flex justify-end">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          onClick={() => setIsEditing(true)}
        >
          Добавить пользователя
        </button>
      </div>

      {isEditing && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-100">
          <h2 className="text-2xl mb-4">
            {editingUser
              ? "Редактировать пользователя"
              : "Добавить нового пользователя"}
          </h2>

          <input
            type="text"
            className="w-full p-2 mb-2 border rounded"
            placeholder="Email"
            value={editingUser ? editingUser.email : newUser.email}
            onChange={(e) => {
              if (editingUser) {
                setEditingUser({ ...editingUser, email: e.target.value });
              } else {
                setNewUser({ ...newUser, email: e.target.value });
              }
            }}
          />

          <input
            type="text"
            className="w-full p-2 mb-2 border rounded"
            placeholder="Имя"
            value={editingUser ? editingUser.name : newUser.name}
            onChange={(e) => {
              if (editingUser) {
                setEditingUser({ ...editingUser, name: e.target.value });
              } else {
                setNewUser({ ...newUser, name: e.target.value });
              }
            }}
          />

          <input
            type="text"
            className="w-full p-2 mb-2 border rounded"
            placeholder="Фамилия"
            value={editingUser ? editingUser.surname : newUser.surname}
            onChange={(e) => {
              if (editingUser) {
                setEditingUser({ ...editingUser, surname: e.target.value });
              } else {
                setNewUser({ ...newUser, surname: e.target.value });
              }
            }}
          />

          <input
            type="password"
            className="w-full p-2 mb-2 border rounded"
            placeholder="Пароль"
            value={editingUser ? editingUser.password : newUser.password}
            onChange={(e) => {
              if (editingUser) {
                setEditingUser({ ...editingUser, password: e.target.value });
              } else {
                setNewUser({ ...newUser, password: e.target.value });
              }
            }}
          />

          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={cancelEditing}
            >
              Отмена
            </button>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              onClick={editingUser ? handleEditUser : handleAddUser}
            >
              {editingUser ? "Сохранить изменения" : "Добавить пользователя"}
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Имя</th>
            <th className="px-4 py-2 text-left">Фамилия</th>
            <th className="px-4 py-2 text-left">Роль</th>
            <th className="px-4 py-2 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.surname}</td>
              <td className="px-4 py-2">{user.roles.join(", ")}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
                  onClick={() => startEditing(user)}
                >
                  Редактировать
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 ml-2"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
