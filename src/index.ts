//TODO: Add new relic
import "newrelic";
import newRelicApolloPlugin from "@newrelic/apollo-server-plugin";
import dotenv from "dotenv"
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
  const server = new ApolloServer({
    schema,
    plugins: [
      newRelicApolloPlugin
    ] 
  });
  const app = Express();
  await server.start();
  server.applyMiddleware({ app: app, path: "/attendance" });




  app.listen(process.env.PORT || 3000,  () => {
    console.log(`Server started on http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`)
  });
}

main();