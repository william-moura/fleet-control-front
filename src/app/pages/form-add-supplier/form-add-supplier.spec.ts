import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddSupplier } from './form-add-supplier';

describe('FormAddSupplier', () => {
  let component: FormAddSupplier;
  let fixture: ComponentFixture<FormAddSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
