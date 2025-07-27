import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedPhone1753606625584 implements MigrationInterface {
    name = 'RemovedPhone1753606625584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phone\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phone\` varchar(255) NOT NULL`);
    }

}
