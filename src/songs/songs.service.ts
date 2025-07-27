import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Song } from './song.entity';
import { query } from 'express';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {

    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistsRepository: Repository<Artist>
    ) {}
    // local db
    // local array

    private songs: CreateSongDTO[] = [
    ];

    async create(createSong: CreateSongDTO): Promise<Song> {
        const song = new Song();
        song.title = createSong.title;
        song.duration = createSong.duration;
        song.lyrics = createSong.lyrics;
        song.releasedDate = createSong.releasedDate;

        const artists = await this.artistsRepository.findByIds(createSong.artist);

        song.artist = artists;

        return this.songsRepository.save(song);
    }

    findAll(): Promise<Song[]> {
        return this.songsRepository.find();
    }

    findOne(id: number): Promise<Song | null> {
        return this.songsRepository.findOneBy({id})        
    }

    async update(id: number, updateSong: UpdateSongDTO): Promise<UpdateResult> {
        let updateData: any = { ...updateSong };
        if (updateSong.artist) {
            const artists = await this.artistsRepository.findByIds(updateSong.artist);
            updateData.artist = artists;
        }
        return this.songsRepository.update(id, updateData);
    }

    async delete(id: number): Promise<void> {
        await this.songsRepository.delete(id);
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
        const queryBuilder = this.songsRepository.createQueryBuilder('song');
        queryBuilder.orderBy('song.releasedDate', 'DESC');
        return paginate<Song>(queryBuilder, options);
    }
}
