
import { buildSchema } from "type-graphql";
import { AttendancesResolver } from "../modules/attendance";
import { FeedbackResolver } from "../modules/feedback";

export const createSchema = () => 
    buildSchema({
        resolvers: [AttendancesResolver, FeedbackResolver]
    });
