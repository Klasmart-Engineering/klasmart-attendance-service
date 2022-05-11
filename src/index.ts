import "newrelic";
import newRelicApolloPlugin from "@newrelic/apollo-server-plugin";
import dotenv from "dotenv";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import  Express from "express";
import { connOptions } from "./typeormConfig";
import { createSchema } from "./utils/createSchema";
import { createConnection } from "typeorm";
import { AttendanceService } from "./services/attendance/AttendanceService";
import { createRedisClient } from "./utils/functions";
dotenv.config();
export let attendanceService: AttendanceService;

const main = async () => {
  
    try {
        await createConnection(
            connOptions  
        );
    }catch(e){
        console.log("Attendance db not configured - skipping");
    }
    const redis = await createRedisClient();
    attendanceService = new AttendanceService(redis);

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
        console.log(`Server started on http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`);
    });
};

main();
