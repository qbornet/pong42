import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(private prisma: PrismaService) {}

  async addMatchHistory(idPlayerWin: string, idPlayerLoose: string) {
    try {
      return await this.prisma.match.create({
        data: {
          playerWin: {
            connect: { id: idPlayerWin }
          },
          playerLoose: {
            connect: { id: idPlayerLoose }
          }
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }
}
