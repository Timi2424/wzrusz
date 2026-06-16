import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { SchedulerEventDto } from './scheduler.dto';
import { SchedulerService } from './scheduler.service';

@Controller('admin/scheduler')
@UseGuards(AdminAuthGuard)
export class SchedulerController {
  constructor(private readonly scheduler: SchedulerService) {}

  @Get('events')
  listEvents(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<SchedulerEventDto[]> {
    return this.scheduler.listEventsInRange({ from, to });
  }
}
