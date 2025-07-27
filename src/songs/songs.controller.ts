import { Controller, Get, Param,  Delete, Patch, Post, Body, HttpException, HttpStatus, ValidationPipe, ParseIntPipe, Inject, Query, DefaultValuePipe, NotFoundException } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/constant/connection';
import { Song } from './song.entity';
import { UpdateSongDTO } from './dto/update-song-dto';
import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('songs')
export class SongsController {

    constructor(private readonly songsService: SongsService,
        @Inject('CONNECTION')
        private connection: Connection,
    ) {}

    @Post()
    create(@Body(ValidationPipe) createSong: CreateSongDTO): Promise<Song> {
        return this.songsService.create(createSong);
    }

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number=10,
    ): Promise<Pagination<Song>> {
        limit = limit > 100 ? 100: limit;
        return this.songsService.paginate({
            page,
            limit,
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
        const song = await this.songsService.findOne(id);
        if (!song) {
            throw new NotFoundException(`Song with id ${id} not found`);
        }
        return song;
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, updateSong: UpdateSongDTO): Promise<UpdateResult> {
        return this.songsService.update(id, updateSong);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.songsService.delete(id);
    }


}
