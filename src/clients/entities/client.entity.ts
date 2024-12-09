import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.clients)
    user: User;

    @OneToMany(() => Payment, payment => payment.client)
    payments: Payment[]; 

    @Column()
    name: string;
    
    @Column()
    neighborhood: string;
    
    @Column()
    price: number;
    
    @Column()
    periodicity: number;

    @Column()
    phoneNumber: string;
}
