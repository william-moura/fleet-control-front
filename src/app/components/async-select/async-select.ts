import { Component, input, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-async-select',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './async-select.html',
  styleUrl: './async-select.scss',
})
export class AsyncSelect {
  private ngControl = inject(NgControl, { optional: true, self: true });
  private destroyRef = inject(DestroyRef);

  options$ = input.required<Observable<any[]>>();
  label = input<string>('Selecione');
  placeholder = input<string>('Escolha uma opção');
  valueKey = input<string>('id');
  displayKey = input<string>('nome');
  multiple = input<boolean>(false);
  disabled = input<boolean>(false);
  control = new FormControl();

  // Callbacks internos vazios exigidos pelo ControlValueAccessor
  private onTouched = () => {};
  private onChange = (_: any) => {};

  constructor() {
    // Configura este componente como o Value Accessor oficial do input pai
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    // Escuta as mudanças de forma reativa e desinscreve automaticamente no destroy
    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.onChange(value);
        this.onTouched();
      });
  }
  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
}
