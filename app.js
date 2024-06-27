import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import dotenv from "dotenv";
import graphqlSchema from "./graphql/schema/index.js";
import graphqlResolver from "./graphql/resolver/index.js";
import isAuth from "./middleware/is-auth.js";
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(isAuth);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver, // points out all resolvers functions
    graphiql: true, // in production, disable graphiql by using isDevelopment
  })
);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("the mongoDB successfully connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
app.listen(3000, () => {
  console.log("listening on port 3000");
});
