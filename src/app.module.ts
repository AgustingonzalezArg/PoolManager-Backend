import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "1234",
      database: "Pool-Manager",
      autoLoadEntities: true,
    })
  }), UsersModule, PaymentsModule, ClientsModule]
})
export class AppModule {
  constructor( private dataSource: DataSource) {}
}
