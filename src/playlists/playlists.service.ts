import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { Song } from 'src/songs/song.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CreatePlayListDTO } from './dto/create-playlist.dto';

@Injectable()
export class PlayListsService {
    constructor(
        @InjectRepository(Playlist)
        private playListRepo: Repository<Playlist>,

        @InjectRepository(Song)
        private songsRepo: Repository<Song>,

        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async create(createPlayList: CreatePlayListDTO): Promise<Playlist> {
        const playList = new Playlist()
        playList.name = createPlayList.name;

        const songs = await this.songsRepo.findByIds(createPlayList.songs);
        playList.songs = songs;

        const user = await this.userRepo.findOneBy({ id: createPlayList.user });
        if (!user) {
            throw new Error(`User with id ${createPlayList.user} not found`);
        }
        playList.user = user;

        return this.playListRepo.save(playList);
    }
}