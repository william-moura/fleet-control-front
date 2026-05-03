import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddFuelSupplier } from './form-add-fuel-supplier';

describe('FormAddFuelSupplier', () => {
  let component: FormAddFuelSupplier;
  let fixture: ComponentFixture<FormAddFuelSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddFuelSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddFuelSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
