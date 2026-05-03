import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddVehicle } from './form-add-vehicle';

describe('FormAddVehicle', () => {
  let component: FormAddVehicle;
  let fixture: ComponentFixture<FormAddVehicle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddVehicle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddVehicle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
