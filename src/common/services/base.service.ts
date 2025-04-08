import { PrismaClient, Usuario, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type ValidModelName = {
  [K in keyof PrismaClient]: PrismaClient[K] extends {
    update(args: any): any;
  }
    ? K
    : never;
}[keyof PrismaClient];

type ModelPayload<T extends ValidModelName> = T extends keyof PrismaClient
  ? PrismaClient[T] extends {
      findUnique(args: any): Promise<infer U>;
    }
    ? U
    : never
  : never;

export class BaseService<TModelName extends ValidModelName> {
  protected readonly modelDelegate: PrismaClient[TModelName];

  constructor(protected readonly model: TModelName) {
    this.modelDelegate = prisma[model];
  }

  async softDelete(
    id: number,
  ): Promise<{ message: string; result: ModelPayload<TModelName> }> {
    const result = await (this.modelDelegate as any).update({
      where: { id },
      data: { deleted: true },
    });

    return {
      message: 'Eliminado correctamente',
      result,
    };
  }
}
