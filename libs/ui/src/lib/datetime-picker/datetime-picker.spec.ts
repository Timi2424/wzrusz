import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { formatDateTimeLocal, startOfToday } from '../datetime/datetime-local';
import { WzDateTimePicker } from './datetime-picker';

@Component({
  imports: [ReactiveFormsModule, WzDateTimePicker],
  template: `<wz-datetime-picker [formControl]="control" />`,
})
class HostComponent {
  readonly control = new FormControl('');
}

describe('WzDateTimePicker', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  it('renders PrimeNG datepicker', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="wz-datetime-picker"]')).toBeTruthy();
  });

  it('writes future datetime string to form control', () => {
    const picker = TestBed.createComponent(WzDateTimePicker);
    picker.detectChanges();

    const future = new Date(startOfToday());
    future.setDate(future.getDate() + 2);
    future.setHours(14, 0, 0, 0);

    picker.componentInstance.writeValue(formatDateTimeLocal(future));
    picker.detectChanges();

    expect(picker.componentInstance['dateValue']()).toEqual(future);
  });
});
