import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/auth-context.jsx";
import ApolloProviderWrapper from "./ApolloProviderWrapper";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ApolloProviderWrapper>
      <App />
    </ApolloProviderWrapper>
  </AuthContextProvider>
);
