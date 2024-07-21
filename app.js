import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import graphqlSchema from "./graphql/schema/index.js";
import graphqlResolver from "./graphql/resolver/index.js";
import isAuth from "./middleware/is-auth.js";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const typeDefs = graphqlSchema;
app.use(bodyParser.json());
app.use(isAuth);
const server = new ApolloServer({
  typeDefs,
  resolvers: graphqlResolver,
});
await server.start();
app.get("/test", (req, res) => {
  const a = 1;
  const b = 2;
  console.log(a + b);
  return res.status(200);
});
app.use("/graphql", cors(), express.json(), expressMiddleware(server));
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("the mongoDB successfully connected");
} catch (error) {
  console.error("MongoDB connection error:", error);
}

app.listen(3000, () => {
  console.log("listening on port 3000");
});
