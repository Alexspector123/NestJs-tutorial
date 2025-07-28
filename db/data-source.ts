import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "src/users/user.entity";
import { Artist } from "src/artists/artist.entity";
import { Song } from "src/songs/song.entity";
import { Playlist } from "src/playlists/playlist.entity";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

//LOAD Environment Variables
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

if (!process.env.NODE_ENV) {
  throw new Error('❌ NODE_ENV is not set. Please set NODE_ENV before running migration.');
}

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'mysql',
            host: configService.get<string>('dbHost'),
            port: configService.get<number>('dbPort'),
            username: configService.get<string>('username'),
            password: configService.get<string>('password'),
            database: configService.get<string>('dbName'),
            entities: [Song, Artist, User, Playlist],
            synchronize: false,
            migrations: ['dist/db/migrations/*.js'],
        }
    }
}

export const dataSourceOptions: DataSourceOptions = ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Song, Artist, User, Playlist],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
});

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
