import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function eventRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('eventStart')?.value as string;
    const end = group.get('eventEnd')?.value as string;

    if (!start || !end) {
      return null;
    }

    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();

    if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
      return null;
    }

    return endMs > startMs ? null : { eventRange: true };
  };
}
