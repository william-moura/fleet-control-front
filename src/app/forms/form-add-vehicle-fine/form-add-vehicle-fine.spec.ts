import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddVehicleFine } from './form-add-vehicle-fine';

describe('FormAddVehicleFine', () => {
  let component: FormAddVehicleFine;
  let fixture: ComponentFixture<FormAddVehicleFine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddVehicleFine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddVehicleFine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
