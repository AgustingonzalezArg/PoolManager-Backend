import { Client } from "src/clients/entities/client.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.payments)
    user: User;

    @ManyToOne(() => Client, client => client.payments)
    client: Client;
    
    @Column()
    date: string;

    @Column()
    price: number;

    @Column()
    payment: boolean;


}
