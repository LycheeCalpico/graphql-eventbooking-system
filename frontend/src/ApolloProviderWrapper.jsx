import { ApolloServer, InMemoryCache, ApolloProvider } from "@apollo/server";
import React from "react";
import { useAuthContext } from "./context/auth-context";

const ApolloProviderWrapper = ({ children }) => {
  const { token } = useAuthContext();
  const client = new ApolloServer({
    uri: "http://localhost:3000/graphql",
    cache: new InMemoryCache(),
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
