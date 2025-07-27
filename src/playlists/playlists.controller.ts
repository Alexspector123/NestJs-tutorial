import { Body, Controller, Post } from "@nestjs/common";
import { PlayListsService } from "./playlists.service";
import { CreatePlayListDTO } from "./dto/create-playlist.dto";
import { Playlist } from "./playlist.entity";

@Controller('playlist')
export class PlayListsController {
    constructor (private readonly playlistService: PlayListsService) {}

    @Post()
    create(
        @Body()
        createPlaylist: CreatePlayListDTO
    ): Promise<Playlist> {
        return this.playlistService.create(createPlaylist);
    }
}