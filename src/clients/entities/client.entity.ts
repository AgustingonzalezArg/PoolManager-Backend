import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.clients, {nullable: false})
    user: User;

    @OneToMany(() => Payment, payment => payment.client, {nullable: false, cascade: true})
    payments: Payment[]; 

    @Column({nullable: false})
    name: string;
    
    @Column({nullable: false})
    neighborhood: string;
    
    @Column({nullable: false})
    price: number;
    
    @Column({nullable: false})
    periodicity: "weekly"| "biweekly" | "monthly";

    @Column({nullable: true})
    phoneNumber: string;
}
