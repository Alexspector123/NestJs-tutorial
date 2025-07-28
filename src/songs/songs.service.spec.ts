import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { Song } from './song.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';

describe('SongService', () => {
  let service: SongsService;
  let repo: Repository<Song>;

  const oneSong = { id: 123, title: 'Lover' };
  const songArray = [{ id: 456, title: 'Lover' }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            find: jest
              .fn()
              .mockImplementation(() => Promise.resolve(songArray)),
            findOneOrFail: jest
              .fn()
              .mockImplementation((options: FindOneOptions<Song>) => {
                return Promise.resolve(oneSong);
              }),
            create: jest
              .fn()
              .mockImplementation((createSongDTO: CreateSongDTO) => {
                return Promise.resolve(oneSong);
              }),
            save: jest.fn(),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateSongDTO: UpdateSongDTO) => {
                  return Promise.resolve({ affected: 1 });
                },
              ),
            delete: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve({ affected: 1 }),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    repo = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should give me the song by id', async () => {
    const song = await service.findOne(123);
    const repoSpy = jest.spyOn(repo, 'findOneOrFail');
    expect(song).toEqual(oneSong);
    expect(repoSpy).toBeCalledWith({ where: { id: 'a uuid' } });
  });

  it('should create the song', async () => {
    const song = await service.create({ title: 'Lover' });
    expect(song).toEqual(oneSong);
    expect(repo.create).toBeCalledTimes(1);
    expect(repo.create).toBeCalledWith({ title: 'Lover' });
  });

  it('should update the song', async () => {
    const result = await service.update(123, { title: 'Lover' });
    expect(repo.update).toBeCalledTimes(1);
    expect(result.affected).toEqual(1);
  });

  it('should delete the song', async () => {
    const song = await service.delete(123);
    const repoSpyOn = jest.spyOn(repo, 'delete');
    expect(repo.delete).toBeCalledTimes(1);
    expect(song.affected).toBe(1);
    expect(repoSpyOn).toBeCalledWith('a uuid');
  });
});