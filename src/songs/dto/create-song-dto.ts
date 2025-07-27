import { IsNumber } from "class-validator";
import { IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateSongDTO {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each:true })
    artist: number[];

    @IsNotEmpty()
    @IsDateString()
    releasedDate: Date;

    @IsNotEmpty()
    duration: string;

    lyrics: string;
}