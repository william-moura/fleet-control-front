import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateVehicleFine } from './add-update-vehicle-fine';

describe('AddUpdateVehicleFine', () => {
  let component: AddUpdateVehicleFine;
  let fixture: ComponentFixture<AddUpdateVehicleFine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateVehicleFine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateVehicleFine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
