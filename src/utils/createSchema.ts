
import { buildSchema } from "type-graphql";
import { AttendancesResolver, FeedbackResolver } from "../modules/index";;

export const createSchema = () => 
  buildSchema({
    resolvers: [AttendancesResolver, FeedbackResolver]
  });
