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

    @IsNumber()
    @IsNotEmpty()
    periodicity;

    @IsString()
    @IsNotEmpty()
    phoneNumber;
}
