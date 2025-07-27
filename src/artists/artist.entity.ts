import { User } from 'src/users/user.entity';
import { Song } from 'src/songs/song.entity';
import { Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artist')
export class Artist {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @ManyToMany(() => Song, (songs) => songs.artist)
    songs: Song[];
}