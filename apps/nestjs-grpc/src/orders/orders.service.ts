import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom, Observable } from 'rxjs';

type Order = {
  asset_id: string;
  quantity: number;
  status: string;
};

interface OrderGrpcClient {
  createOrder(
    data: { account_id: string; asset_id: string; quantity: number },
    metaData?: Metadata,
  ): Observable<{ order: Order }>;
  findAllOrders(
    data: { account_id: string },
    metaData?: Metadata,
  ): Observable<{ orders: Order[] }>;
  findOneOrder(
    data: { order_id: string },
    metaData?: Metadata,
  ): Observable<{ order: Order }>;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'fullcycle',
      protoPath: [join(__dirname, 'orders', 'proto', 'orders.proto')],
      loader: { keepCase: true },
    },
  })
  clintGrpc: ClientGrpc;

  private orderClientGrpc: OrderGrpcClient;

  onModuleInit() {
    this.orderClientGrpc = this.clintGrpc.getService('OrderService');
  }
  async create(createOrderDto: CreateOrderDto) {
    const result = await lastValueFrom(
      this.orderClientGrpc.createOrder(createOrderDto),
    );
    return result.order;
  }

  async findAll(account_id: string) {
    const result = await lastValueFrom(
      this.orderClientGrpc.findAllOrders({ account_id }),
    );
    return result.orders;
  }

  async findOne(id: string) {
    const result = await lastValueFrom(
      this.orderClientGrpc.findOneOrder({ order_id: id }),
    );
    return result.order;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order ${updateOrderDto}`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
