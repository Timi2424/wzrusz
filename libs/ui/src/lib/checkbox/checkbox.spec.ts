import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WzCheckbox } from './checkbox';

@Component({
  imports: [ReactiveFormsModule, WzCheckbox],
  template: `<wz-checkbox [formControl]="control">Potrzebuję faktury</wz-checkbox>`,
})
class HostComponent {
  readonly control = new FormControl(false);
}

describe('WzCheckbox', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('renders label content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Potrzebuję faktury');
  });

  it('syncs checked state with form control', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.wz-checkbox__native') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(true);
  });
});
