import { FC, useContext } from "react";
import { Context } from "../main.tsx";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const Header: FC = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  // Функция для выхода
  const handleLogout = () => {
    store.logout();
    navigate("/login"); // Перенаправление на страницу входа
  };

  // Проверка роли администратора
  const isAdmin = store.user?.roles?.includes("ADMIN");

  return (
    <header className="w-full bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Панель управления</h1>

        {isAdmin && (
          <div className="ml-4">
            <button
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
              onClick={() => navigate("/users")} // Используем navigate
            >
              Пользователи
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Выйти
        </button>
      </div>
    </header>
  );
};

export default observer(Header);
