import { Client } from "src/clients/entities/client.entity";
import { Payment } from "src/payments/entities/payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    hash: string;
    
    @OneToMany(() => Client, clients => clients.user)
    clients: Client[]

    @OneToMany(() => Payment, payment => payment.user)
    payments: Payment[]
}
