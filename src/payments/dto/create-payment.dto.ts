import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsBoolean()
    @IsNotEmpty()
    payment: boolean;

    @IsNumber()
    @IsNotEmpty()
    idClient: number;
}

