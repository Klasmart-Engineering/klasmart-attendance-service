import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn, Index } from "typeorm";

@ObjectType()
@Entity()
export class Attendance extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: "session_id" })
  sessionId!: string;

  @Field()
  @PrimaryColumn({ name: "join_timestamp" })
  joinTimestamp!: Date;

  @Field()
  @PrimaryColumn({ name: "leave_timestamp" })
  leaveTimestamp!: Date;

  @Field()
  @PrimaryColumn({ name: "is_teacher", default: false })
  isTeacher!: Boolean

  @Field()
  @Index()
  @Column({ name: "room_id", nullable: true })
  roomId?: string
  
  @Field()
  @Index()
  @Column({ name: "user_id" })
  userId!: string
}
