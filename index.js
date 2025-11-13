import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

async function Server() {
  dotenv.config();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await mongoose
    .connect(
      "mongodb+srv://Fresh-mart-ecommerce:sXJ0hsxzCrkyuJ7B@cluster0.iltfauk.mongodb.net/fresh-mart-db"
    )
    // await mongoose.connect('mongodb://localhost:27017/fresh-mart-db')
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log("DB connection error:", error));

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ req }),
    listen: { port: 6380 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

Server();
