import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { SongsModule } from './songs/songs.module';
import { PlayListsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { AppService } from './app.service';

import { Song } from './songs/song.entity';
import { Artist } from './artists/artist.entity';
import { User } from './users/user.entity';
import { Playlist } from './playlists/playlist.entity';

import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

import { DevConfigService } from './common/providers/DevConfigService';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    PlayListsModule,
    SongsModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    ArtistsModule,
  ],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService
    }
  ]
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware)
      .forRoutes('songs');
  }
}
