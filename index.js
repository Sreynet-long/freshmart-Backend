import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.js";
import { ApolloServer, HeaderMap } from "@apollo/server";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

async function Server() {
  dotenv.config();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Create Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  // Attach Apollo to Express manually
  app.all("/graphql", async (req, res) => {
    try {
      const headers = new HeaderMap();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value)
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }

      const httpGraphQLRequest = {
        method: req.method,
        headers,
        search: req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "",
        body: req.body,
      };

      // ✅ Use the correct variable name here
      const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
        httpGraphQLRequest,
        context: async () => ({ req, res }),
      });

      // Send headers
      for (const [key, value] of httpGraphQLResponse.headers) {
        res.setHeader(key, value);
      }

      res.statusCode = httpGraphQLResponse.status || 200;

      if (httpGraphQLResponse.body.kind === "complete") {
        return res.end(httpGraphQLResponse.body.string);
      }

      for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
        res.write(chunk);
      }
      res.end();
    } catch (error) {
      console.error("GRAPHQL ERROR:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // REST Upload Routes
  app.use("/upload", uploadRoutes);

  // MongoDB connection
  await mongoose
    .connect(
      "mongodb+srv://Fresh-mart-ecommerce:sXJ0hsxzCrkyuJ7B@cluster0.iltfauk.mongodb.net/fresh-mart-db"
    )
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log("DB connection error:", error));

  const PORT = process.env.PORT || 6380;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

Server();
