import { Artist } from "src/artists/artist.entity";
import { Playlist } from "src/playlists/playlist.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";

@Entity()
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('date')
    releasedDate: Date;

    @Column('time')
    duration: string;

    @Column('text')
    lyrics: string;

    @ManyToMany(() => Artist, (artists) => artists.songs, { cascade: true })
    @JoinTable({name: 'songs_artists'})
    artist: Artist[];

    @ManyToOne(() => Playlist, (playlist) => playlist.songs)
    playList: Playlist;
}