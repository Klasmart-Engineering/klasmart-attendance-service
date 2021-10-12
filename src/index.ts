import * as dotenv from "dotenv"
import "reflect-metadata";
import "module-alias/register";
import { ApolloServer } from "apollo-server-express";
import  Express from "express";
import { connectPostgres } from "./postgresDB";
import { createSchema } from "./utils/createSchema";


dotenv.config();

const main = async () => {
  await connectPostgres();
  const schema = await createSchema();
  const server = new ApolloServer({ schema });
  const app = Express();
  await server.start();
  server.applyMiddleware({ app });
  
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on http://localhost:3000/graphql")
  });
}

main();