import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { SongsModule } from './songs/songs.module';
import { PlayListsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { AppService } from './app.service';

import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

import { DevConfigService } from './common/providers/DevConfigService';
import { ArtistsModule } from './artists/artists.module';
import { typeOrmAsyncConfig } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';


@Module({
  imports: [
    PlayListsModule,
    SongsModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    ArtistsModule,
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
  ],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService
    }
  ]
})
export class AppModule {}
