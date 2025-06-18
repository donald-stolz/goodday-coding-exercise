import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { CamelCaseInterceptor } from '../interceptors/camel-case.interceptor';
import { SnakeCaseInterceptor } from '../interceptors/snake-case.interceptor';

@Controller('purchase-orders')
@UseInterceptors(CamelCaseInterceptor)
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @UseInterceptors(SnakeCaseInterceptor)
  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @Get()
  findAll() {
    return this.purchaseOrdersService.findAll();
  }

  @UseInterceptors(SnakeCaseInterceptor)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto
  ) {
    console.log('updatePurchaseOrderDto');
    console.log(updatePurchaseOrderDto);
    return this.purchaseOrdersService.update(+id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrdersService.remove(+id);
  }
}
