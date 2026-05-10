import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UppercaseDirective } from '../../uppercase';

@Component({
  selector: 'app-form-add-brand',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, UppercaseDirective],
  providers:[
  ],
  templateUrl: './form-add-brand.html',
  styleUrl: './form-add-brand.scss',
})
export class FormAddBrand {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddBrand>);  
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    if (this.data) {
      const dataForm = { ...this.data };
      this.form.patchValue(dataForm);
    }
  }
  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
