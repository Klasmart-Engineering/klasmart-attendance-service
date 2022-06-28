import "newrelic";
import newRelicApolloPlugin from "@newrelic/apollo-server-plugin";
import dotenv from "dotenv";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import  Express from "express";
import helmet from "helmet";
import { connOptions } from "./typeormConfig";
import { createSchema } from "./utils/createSchema";
import { DataSource } from "typeorm";
import { AttendanceService } from "./services/attendance/AttendanceService";
import { createRedisClient } from "./utils/functions";

dotenv.config();
export let attendanceService: AttendanceService;
export let connection: DataSource;

const main = async () => {
    attendanceService = new AttendanceService();
    try {
        connection = new DataSource(
            connOptions  
        );
        await connection.initialize();
    }catch(e){
        console.log("Attendance db not configured - skipping");
    }
    
    const redis = await createRedisClient();
    await attendanceService.startScheduler(redis);
    const schema = await createSchema();
    const server = new ApolloServer({
        schema,
        plugins: [
            newRelicApolloPlugin
        ] 
    });
    const app = Express();
    app.use(helmet());
    await server.start();
    server.applyMiddleware({ app: app, path: "/attendance" });
   
    app.listen(process.env.PORT || 3000,  () => {
        console.log(`Server started on http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`);
    });
};

main();
