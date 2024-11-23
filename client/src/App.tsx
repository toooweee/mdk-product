import LoginForm from "./components/LoginForm.tsx";
import { useContext, useEffect } from "react";
import { Context } from "./main.tsx";
import { observer } from "mobx-react-lite";

function App() {
  const { store } = useContext(Context);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  if (!store.isAuth) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.email}`
          : `АВТОРИЗУЙСЯ`}
      </h1>
    </div>
  );
}

export default observer(App);
