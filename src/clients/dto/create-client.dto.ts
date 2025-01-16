import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateClientDto {

    @IsString()
    @IsNotEmpty()
    name;

    @IsString()
    @IsNotEmpty()
    neighborhood;

    @IsNumber()
    @IsNotEmpty()
    price;

    @IsString()
    @IsNotEmpty()
    periodicity;

    @IsString()
    @IsOptional()
    phoneNumber;
}
