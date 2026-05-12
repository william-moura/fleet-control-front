import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFines } from './vehicle-fines';

describe('VehicleFines', () => {
  let component: VehicleFines;
  let fixture: ComponentFixture<VehicleFines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleFines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
