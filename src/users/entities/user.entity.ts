import { Client } from "src/clients/entities/client.entity";
import { Payment } from "src/payments/entities/payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    username: string;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: false})
    hash: string;
    
    @OneToMany(() => Client, clients => clients.user, {nullable: false})
    clients: Client[]

    @OneToMany(() => Payment, payment => payment.user, {nullable: false})
    payments: Payment[]
}
