import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddMaintenanceService } from './form-add-maintenance-service';

describe('FormAddMaintenanceService', () => {
  let component: FormAddMaintenanceService;
  let fixture: ComponentFixture<FormAddMaintenanceService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddMaintenanceService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddMaintenanceService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
