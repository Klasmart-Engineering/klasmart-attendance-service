import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1641536505100 implements MigrationInterface {
    name = "CreateDatabase1641536505100";

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("\x1b[35m", "running migrations\n");
        const feedback = await queryRunner.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'feedback'");
        if(feedback.length === 0) {
            console.log("\x1b[36m%s\x1b[0m", "could not find feedback table, creating one ...");
            await queryRunner.query("CREATE TYPE \"public\".\"feedback_type_enum\" AS ENUM('leave_class', 'end_class')");
            await queryRunner.query("CREATE TABLE \"feedback\" (\"session_id\" character varying NOT NULL, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"room_id\" character varying, \"user_id\" character varying NOT NULL, \"type\" \"public\".\"feedback_type_enum\" NOT NULL, \"stars\" integer NOT NULL, \"comment\" character varying, CONSTRAINT \"PK_e5bfaf86ab81e5ce5c1b54559d7\" PRIMARY KEY (\"session_id\"))");
            await queryRunner.query("CREATE INDEX \"IDX_2c2bc370a4c6a7f2f579cd8499\" ON \"feedback\" (\"room_id\") ");
            await queryRunner.query("CREATE INDEX \"IDX_121c67d42dd543cca0809f5990\" ON \"feedback\" (\"user_id\") ");
            await queryRunner.query("CREATE TYPE \"public\".\"quick_feedback_type_enum\" AS ENUM('video', 'audio', 'presentation', 'other')");
            await queryRunner.query("CREATE TABLE \"quick_feedback\" (\"id\" SERIAL NOT NULL, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"type\" \"public\".\"quick_feedback_type_enum\" NOT NULL, \"stars\" integer NOT NULL, \"feedbackSessionId\" character varying, CONSTRAINT \"PK_f171e0608de254b207d1214ab1f\" PRIMARY KEY (\"id\"))");
            await queryRunner.query("ALTER TABLE \"quick_feedback\" ADD CONSTRAINT \"FK_a74d52d0b376097a7cd31c8104d\" FOREIGN KEY (\"feedbackSessionId\") REFERENCES \"feedback\"(\"session_id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
            console.log("\x1b[36m%s\x1b[0m", "table created!");
        }else{
            console.log("\x1b[36m%s\x1b[0m", "feedback table already exist,  skipping!");
        }

        const attendance = await queryRunner.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'attendance'");
        if(attendance.length === 0){
            console.log("\x1b[36m%s\x1b[0m","\ncould not find attendance table, creating one ...");
            await queryRunner.query("CREATE TABLE \"attendance\" (\"session_id\" character varying NOT NULL, \"join_timestamp\" TIMESTAMP NOT NULL, \"leave_timestamp\" TIMESTAMP NOT NULL, \"room_id\" character varying, \"user_id\" character varying NOT NULL, CONSTRAINT \"PK_6faeaae2bb6960b5ca7728ac6c8\" PRIMARY KEY (\"session_id\", \"join_timestamp\", \"leave_timestamp\"))");
            await queryRunner.query("CREATE INDEX \"IDX_7e820f3d6344144d583e6101d4\" ON \"attendance\" (\"room_id\") ");
            await queryRunner.query("CREATE INDEX \"IDX_0bedbcc8d5f9b9ec4979f51959\" ON \"attendance\" (\"user_id\") ");
            console.log("\x1b[36m%s\x1b[0m","table created!");
        }else{
            console.log("\x1b[36m%s\x1b[0m", "attendance table already exist,  skipping!");
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"quick_feedback\" DROP CONSTRAINT \"FK_a74d52d0b376097a7cd31c8104d\"");
        await queryRunner.query("DROP INDEX \"public\".\"IDX_0bedbcc8d5f9b9ec4979f51959\"");
        await queryRunner.query("DROP INDEX \"public\".\"IDX_7e820f3d6344144d583e6101d4\"");
        await queryRunner.query("DROP TABLE \"attendance\"");
        await queryRunner.query("DROP TABLE \"quick_feedback\"");
        await queryRunner.query("DROP TYPE \"public\".\"quick_feedback_type_enum\"");
        await queryRunner.query("DROP INDEX \"public\".\"IDX_121c67d42dd543cca0809f5990\"");
        await queryRunner.query("DROP INDEX \"public\".\"IDX_2c2bc370a4c6a7f2f579cd8499\"");
        await queryRunner.query("DROP TABLE \"feedback\"");
        await queryRunner.query("DROP TYPE \"public\".\"feedback_type_enum\"");
    }

}
