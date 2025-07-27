import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigrations1753606520338 implements MigrationInterface {
    name = 'MyMigrations1753606520338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`artist\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, UNIQUE INDEX \`REL_3c2c776c0a094c15d6c165494c\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`song\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`releasedDate\` date NOT NULL, \`duration\` time NOT NULL, \`lyrics\` text NOT NULL, \`playListId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`playlists\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`twoFASecret\` text NULL, \`enable2FA\` tinyint NOT NULL DEFAULT 0, \`apiKey\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`songs_artists\` (\`songId\` int NOT NULL, \`artistId\` int NOT NULL, INDEX \`IDX_6b46ee473a9983b18d8100860a\` (\`songId\`), INDEX \`IDX_96b0b944763714051934dfa3ae\` (\`artistId\`), PRIMARY KEY (\`songId\`, \`artistId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`artist\` ADD CONSTRAINT \`FK_3c2c776c0a094c15d6c165494c0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD CONSTRAINT \`FK_ad629cc6d1dc1c9eca8d0a37ffb\` FOREIGN KEY (\`playListId\`) REFERENCES \`playlists\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`playlists\` ADD CONSTRAINT \`FK_708a919e9aa49019000d9e9b68e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`songs_artists\` ADD CONSTRAINT \`FK_6b46ee473a9983b18d8100860ad\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`songs_artists\` ADD CONSTRAINT \`FK_96b0b944763714051934dfa3aea\` FOREIGN KEY (\`artistId\`) REFERENCES \`artist\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`songs_artists\` DROP FOREIGN KEY \`FK_96b0b944763714051934dfa3aea\``);
        await queryRunner.query(`ALTER TABLE \`songs_artists\` DROP FOREIGN KEY \`FK_6b46ee473a9983b18d8100860ad\``);
        await queryRunner.query(`ALTER TABLE \`playlists\` DROP FOREIGN KEY \`FK_708a919e9aa49019000d9e9b68e\``);
        await queryRunner.query(`ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_ad629cc6d1dc1c9eca8d0a37ffb\``);
        await queryRunner.query(`ALTER TABLE \`artist\` DROP FOREIGN KEY \`FK_3c2c776c0a094c15d6c165494c0\``);
        await queryRunner.query(`DROP INDEX \`IDX_96b0b944763714051934dfa3ae\` ON \`songs_artists\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b46ee473a9983b18d8100860a\` ON \`songs_artists\``);
        await queryRunner.query(`DROP TABLE \`songs_artists\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`playlists\``);
        await queryRunner.query(`DROP TABLE \`song\``);
        await queryRunner.query(`DROP INDEX \`REL_3c2c776c0a094c15d6c165494c\` ON \`artist\``);
        await queryRunner.query(`DROP TABLE \`artist\``);
    }

}
