import { IsString, IsNotEmpty } from "class-validator";

export class ValidateTokenDTO {
    @IsString()
    @IsNotEmpty()
    token: string;
}