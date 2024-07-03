import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth-context";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuthContext();
  const Navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      query: `
      query{login(email: "${email}", password: "${password}"){userId token tokenExpiration}}
      `,
    };
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      login(data.data.login.token, data.data.login.userId);
      Navigate("/events");
    } catch (error) {
      throw error;
    }
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      query: `
      mutation{createUser(userInput: {email: "${email}", password: "${password}"}){_id email password}}
      `,
    };
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setIsLogin(true);
    } catch (error) {
      throw error;
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-1/3 h-1/2 flex flex-col items-center justify-center border-2 rounded-lg shadow-lg">
        <h1 className="mb-4 text-xl font-bold text-emerald-200">
          {isLogin ? "Login" : "SignUp"}
        </h1>
        <form
          className="w-full flex flex-col items-center justify-center"
          onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}
        >
          <div className="flex flex-col w-1/2 mb-4">
            <label htmlFor="">Email</label>
            <input
              type="text"
              className="border py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-1/2 mb-4">
            <label htmlFor="">Password</label>
            <input
              type="text"
              className="border py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>
        <div className="flex flex-col">
          <button
            className="border mb-4 py-2 px-4 bg-emerald-100 rounded-lg"
            onClick={(e) => setIsLogin((isLogin) => !isLogin)}
          >
            {` Switch to ${isLogin ? "signup" : "login"}`}
          </button>
          <button
            className="border py-2 px-4 bgvg-emerald-100 rounded-lg"
            onClick={isLogin ? handleLoginSubmit : handleSignupSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
