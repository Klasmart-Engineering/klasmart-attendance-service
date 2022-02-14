import {MigrationInterface, QueryRunner} from "typeorm";

export class AttendanceUpdate1641536505691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = await queryRunner.query(`SELECT 1 
                FROM 
                    information_schema.columns 
                WHERE 
                    table_name='attendance' and column_name='is_teacher';`);
        if(query.length === 0){
            await queryRunner.query(`ALTER TABLE attendance ADD COLUMN "is_teacher" BOOLEAN DEFAULT FALSE`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE attendance DROP "is_teacher"`);
    }

}
