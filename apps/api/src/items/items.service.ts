import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findWhereIn(ids: number[]) {
    return this.prisma.item.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  findAll() {
    return this.prisma.item.findMany();
  }
}
