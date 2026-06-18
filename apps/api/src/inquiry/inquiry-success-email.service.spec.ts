import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryStatus } from '../database/entities/inquiry-status.enum';
import { InquiryNotificationService } from './inquiry-notification.service';
import { InquirySuccessEmailService } from './inquiry-success-email.service';

describe('InquirySuccessEmailService', () => {
  let service: InquirySuccessEmailService;
  let inquiries: jest.Mocked<Pick<Repository<Inquiry>, 'findOne' | 'save'>>;
  let notifications: jest.Mocked<Pick<InquiryNotificationService, 'sendSuccessConfirmation'>>;

  const approvedInquiry: Inquiry = {
    id: 'inq-1',
    fullName: 'Anna Kowalska',
    email: 'anna@example.com',
    phone: null,
    eventStart: new Date('2026-07-01T08:00:00.000Z'),
    eventEnd: new Date('2026-07-02T18:00:00.000Z'),
    transportAddress: 'Kraków',
    needsInvoice: false,
    invoiceNotes: null,
    status: InquiryStatus.Approved,
    successEmailSentAt: null,
    lineItems: [],
    createdAt: new Date('2026-06-01T10:00:00.000Z'),
  };

  beforeEach(async () => {
    inquiries = {
      findOne: jest.fn(),
      save: jest.fn().mockImplementation(async (row: Inquiry) => row),
    };
    notifications = {
      sendSuccessConfirmation: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        InquirySuccessEmailService,
        {
          provide: getRepositoryToken(Inquiry),
          useValue: inquiries,
        },
        {
          provide: InquiryNotificationService,
          useValue: notifications,
        },
      ],
    }).compile();

    service = moduleRef.get(InquirySuccessEmailService);
  });

  it('sends success email for approved inquiry and stamps sent time', async () => {
    inquiries.findOne.mockResolvedValue({ ...approvedInquiry });

    const result = await service.send('inq-1');

    expect(notifications.sendSuccessConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'inq-1', email: 'anna@example.com' }),
    );
    expect(inquiries.save).toHaveBeenCalledWith(
      expect.objectContaining({
        successEmailSentAt: expect.any(Date),
      }),
    );
    expect(result.inquiryId).toBe('inq-1');
    expect(result.successEmailSentAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('rejects non-approved inquiry', async () => {
    inquiries.findOne.mockResolvedValue({
      ...approvedInquiry,
      status: InquiryStatus.Submitted,
    });

    await expect(service.send('inq-1')).rejects.toBeInstanceOf(ConflictException);
    expect(notifications.sendSuccessConfirmation).not.toHaveBeenCalled();
  });

  it('throws when inquiry is missing', async () => {
    inquiries.findOne.mockResolvedValue(null);

    await expect(service.send('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
