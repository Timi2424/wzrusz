import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let query: jest.Mock;

  beforeEach(async () => {
    query = jest.fn().mockResolvedValue([{ '?column?': 1 }]);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DataSource,
          useValue: {
            isInitialized: true,
            query,
          },
        },
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  it('returns database up when SELECT 1 succeeds', async () => {
    await expect(controller.check()).resolves.toEqual({
      status: 'ok',
      database: 'up',
    });
    expect(query).toHaveBeenCalledWith('SELECT 1');
  });

  it('returns database down when query fails', async () => {
    query.mockRejectedValueOnce(new Error('connection refused'));

    await expect(controller.check()).resolves.toEqual({
      status: 'ok',
      database: 'down',
    });
  });

  it('returns database down when DataSource is not initialized', async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DataSource,
          useValue: { isInitialized: false, query },
        },
      ],
    }).compile();

    const ctrl = module.get(HealthController);

    await expect(ctrl.check()).resolves.toEqual({
      status: 'ok',
      database: 'down',
    });
    expect(query).not.toHaveBeenCalled();
  });
});
