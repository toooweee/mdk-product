import { FC, useContext, useState } from "react";
import { Context } from "../main.tsx";
import { observer } from "mobx-react-lite";

const LoginForm: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store } = useContext(Context);

  return (
    <div className="h-screen flex bg-gray-100 ">
      {/* Левая часть */}
      <div className="w-2/5 bg-gray-900 flex flex-col justify-between text-white p-8 py-20 rounded-br-3xl rounded-tr-3xl">
        <div>
          <h1 className="text-4xl font-bold mb-40">ООО "Джи Эм Трейд"</h1>
          <p className="text-lg">Единый портал обучения сотрудников.</p>
        </div>
        <div>
          <p className="text-sm font-medium">Директор компании</p>
          <p className="text-xl font-bold">Антон Олегович</p>
        </div>
      </div>

      {/* Правая часть */}
      <div className="w-3/5 flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Войти
          </h2>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Пароль"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => store.login(email, password)}
            >
              Войти
            </button>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Еще нет аккаунта?{" "}
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 underline font-medium"
            >
              Подать заявку
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default observer(LoginForm);
