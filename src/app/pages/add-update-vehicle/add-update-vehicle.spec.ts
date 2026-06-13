import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateVehicle } from './add-update-vehicle';

describe('AddUpdateVehicle', () => {
  let component: AddUpdateVehicle;
  let fixture: ComponentFixture<AddUpdateVehicle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateVehicle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateVehicle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
