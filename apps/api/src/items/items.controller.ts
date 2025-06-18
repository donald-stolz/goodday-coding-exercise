import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CamelCaseInterceptor } from '../interceptors/camel-case.interceptor';

@Controller('items')
@UseInterceptors(CamelCaseInterceptor)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
}
