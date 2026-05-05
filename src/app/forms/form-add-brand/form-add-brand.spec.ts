import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddBrand } from './form-add-brand';

describe('FormAddBrand', () => {
  let component: FormAddBrand;
  let fixture: ComponentFixture<FormAddBrand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddBrand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddBrand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
