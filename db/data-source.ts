import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "src/users/user.entity";
import { Artist } from "src/artists/artist.entity";
import { Song } from "src/songs/song.entity";
import { Playlist } from "src/playlists/playlist.entity";

export const dataSourceOptions: DataSourceOptions = ({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'memorizex12345',
    database: 'test',
    entities: [Song, Artist, User, Playlist],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
});

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
