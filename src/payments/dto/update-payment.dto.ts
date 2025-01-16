import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsBoolean()
    @IsNotEmpty()
    payment: boolean;

    @IsOptional()
    @IsBoolean()
    cleaning: boolean;
}

