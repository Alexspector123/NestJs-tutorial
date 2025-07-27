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

@Module({
  imports: [
    PlayListsModule,
    SongsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'memorizex12345',
      database: 'test',
      entities: [Song, Artist, User, Playlist],
      synchronize: true, // Choose false when change to production
    }),
    AuthModule,
    UsersModule,
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
