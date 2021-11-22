import { BaseEntity, Column, Entity, PrimaryColumn, Index, CreateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { Field, ObjectType, InputType } from "type-graphql";
import { QuickFeedbackType, FeedbackType } from "../types";

@ObjectType()
@Entity()
export class Feedback extends BaseEntity {  

    @Field()
    @PrimaryColumn({ name: "session_id" })
    sessionId!: string

    @Field()
    @CreateDateColumn({ name: "created_at"})
    createdAt!: Date

    @Field()
    @Index()
    @Column({ name: "room_id", nullable: true })
    roomId?: string
    
    @Field()
    @Index()
    @Column({ name: "user_id" })
    userId!: string

    @Field()
    @Column({
        type: "enum",
        enum: FeedbackType,
    })
    type!: FeedbackType

    @Field()
    @Column({ name: "stars" })
    stars!: number

    @Field()
    @Column({ name: "comment", nullable: true })
    comment?: string 

    @OneToMany(() => QuickFeedback, quickFeedback => quickFeedback.feedback, { cascade: true })
    quickFeedback?: QuickFeedback[];
}

@InputType()
@Entity()
export class QuickFeedback extends BaseEntity {    

    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @CreateDateColumn({ name: "created_at"})
    createdAt!: Date

    @Field()
    @Column({
        type: "enum",
        enum: QuickFeedbackType,
    })
    type!: QuickFeedbackType

    @Field()
    @Column({ name: "stars" })
    stars!: number

    @ManyToOne(() => Feedback, feedback => feedback.quickFeedback)
    feedback?: Feedback;
}


@InputType()
export class QuickFeedbackInputType {
    @Field()
    type: string;
    
    @Field()
    stars: number;
}
  
