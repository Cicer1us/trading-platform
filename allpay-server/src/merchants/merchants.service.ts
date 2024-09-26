import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Merchant, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MerchantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(merchantInput: Prisma.MerchantCreateInput) {
    const merchant = await this.findBy({ email: merchantInput.email });
    if (merchant) {
      throw new ConflictException('User with this email already exists');
    }

    merchantInput.password = this.hashPassword(merchantInput.password);

    return this.prisma.merchant.create({ data: merchantInput });
  }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, password.length);
  }

  async update(merchant: Merchant, data: Prisma.MerchantUpdateInput) {
    return this.prisma.merchant.update({
      where: { id: merchant.id },
      data,
    });
  }

  findBy(where: Prisma.MerchantWhereUniqueInput) {
    return this.prisma.merchant.findFirst({
      where,
    });
  }
}
