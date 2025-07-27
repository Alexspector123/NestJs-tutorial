import { IsNumber } from "class-validator";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreatePlayListDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each:true })
    songs: number[];

    @IsNotEmpty()
    @IsNumber()
    user: number;
}