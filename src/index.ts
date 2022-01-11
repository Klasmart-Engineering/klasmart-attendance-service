import "newrelic";
import newRelicApolloPlugin from "@newrelic/apollo-server-plugin";
import dotenv from "dotenv"
import "reflect-metadata";
import "module-alias/register";
import { ApolloServer } from "apollo-server-express";
import  Express from "express";
import connOptions from "./typeormConfig";
import { createSchema } from "./utils/createSchema";
import { createConnection } from "typeorm";


dotenv.config();

const main = async () => {
  
  if (process.env.POSTGRES_DATABASE_URL) {
    await createConnection(
      connOptions  
    );
  }else{
    console.log("Attendance db not configured - skipping");
  }
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