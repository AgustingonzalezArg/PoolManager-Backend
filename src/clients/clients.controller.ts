import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Key } from 'readline';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post(":id")
  create(@Param("id") idUser, @Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(+idUser, createClientDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.clientsService.findAll(+id);
  }

  // @Get('cleantoday/:id')
  // findCleanToday(@Param('id') id: string) {
  //   return this.clientsService.findCleanToday(+id);
  // }

  // @Get('poolstoday/:id')
  // poolsToday(@Param('id') id: string) {
  //   return this.clientsService.poolsToday(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  // @Patch('cleantoday/:id')
  // updateCleanToday(@Param('id') id: string, @Body() arrayIds: Key[]) {
  //   console.log(arrayIds)
  //   return this.clientsService.updateCleanToday(+id, arrayIds);
  // }

  // @Patch('cleantomorrow/:id')
  // updateCleanTomorrow(@Param('id') id: string, @Body() arrayIds: Key[]) {
  //   console.log(arrayIds)
  //   return this.clientsService.updateCleanTomorrow(+id, arrayIds);
  // }

  @Delete(':idUser/:id')
  remove(
    @Param('idUser') idUser: string,
    @Param('id') id: string
) {
    return this.clientsService.remove(+idUser, +id );
  }
}
