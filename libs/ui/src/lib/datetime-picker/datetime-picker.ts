import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import {
  formatDateTimeLocal,
  parseDateTimeLocal,
  resolveMinDate,
} from '../datetime/datetime-local';

@Component({
  selector: 'wz-datetime-picker',
  imports: [DatePicker, FormsModule],
  templateUrl: './datetime-picker.html',
  styleUrl: './datetime-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WzDateTimePicker),
      multi: true,
    },
  ],
})
export class WzDateTimePicker implements ControlValueAccessor {
  readonly blockPastDates = input(true);
  readonly minDate = input<Date | null>(null);
  readonly placeholder = input('Wybierz datę i godzinę');
  readonly ariaLabelledBy = input<string | undefined>();

  protected readonly dateValue = signal<Date | null>(null);
  protected readonly disabled = signal(false);

  protected readonly resolvedMinDate = computed(() =>
    resolveMinDate({
      blockPastDates: this.blockPastDates(),
      floor: this.minDate(),
    }),
  );

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.dateValue.set(parseDateTimeLocal(value ?? '') ?? null);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onDateChange(date: Date | Date[] | null): void {
    const next = Array.isArray(date) ? (date[0] ?? null) : date;
    this.dateValue.set(next);
    this.onChange(next ? formatDateTimeLocal(next) : '');
    this.onTouched();
  }
}
