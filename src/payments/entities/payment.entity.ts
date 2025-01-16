import { Client } from "src/clients/entities/client.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.payments)
    user: User;

    @ManyToOne(() => Client, client => client.payments, {onDelete: "CASCADE"})
    client: Client;
    
    @Column({type: "timestamp", nullable: false})
    date: Date;

    @Column({nullable: false})
    price: number;

    @Column({nullable: false})
    payment: boolean;

    @Column({nullable:false, default: false})
    cleaning: boolean
}
