import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddMaintenance } from './form-add-maintenance';

describe('FormAddMaintenance', () => {
  let component: FormAddMaintenance;
  let fixture: ComponentFixture<FormAddMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddMaintenance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddMaintenance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
