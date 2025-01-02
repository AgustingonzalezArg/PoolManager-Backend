import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
    @IsNotEmpty()
    phoneNumber;
}
