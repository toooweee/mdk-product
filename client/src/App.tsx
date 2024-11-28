import React, { useContext, useEffect, useState } from "react";
import { Context } from "./main.tsx";
import { observer } from "mobx-react-lite";
import LoginForm from "./components/LoginForm.tsx";
import Header from "./components/Header.tsx";
import { useNavigate } from "react-router-dom";
import UsersPage from "./components/UsersPage.tsx";

function App() {
  const { store } = useContext(Context);
  const [isAdmin, setIsAdmin] = useState(false); // Состояние для проверки роли
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  useEffect(() => {
    // Устанавливаем isAdmin, проверяя роль пользователя
    if (store.user?.roles?.includes("ADMIN")) {
      setIsAdmin(true);
    }
  }, [store.user]);

  if (!store.isAuth) {
    return <LoginForm />; // Если не авторизован, показываем форму входа
  }

  return (
    <div>
      <Header /> {/* Добавляем компонент Header */}
      {isAdmin ? (
        // Если пользователь администратор, показываем страницу пользователей
        <UsersPage />
      ) : (
        // Если не администратор, показываем основной контент
        <div className="p-8">
          <h1>
            {store.isAuth
              ? `Пользователь авторизован ${store.user.email}`
              : `АВТОРИЗУЙСЯ`}
          </h1>
        </div>
      )}
    </div>
  );
}

export default observer(App);
