import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check(): Promise<{ status: 'ok'; database: 'up' | 'down' }> {
    return {
      status: 'ok',
      database: await this.pingDatabase(),
    };
  }

  private async pingDatabase(): Promise<'up' | 'down'> {
    if (!this.dataSource.isInitialized) {
      return 'down';
    }

    try {
      await this.dataSource.query('SELECT 1');
      return 'up';
    } catch {
      return 'down';
    }
  }
}
