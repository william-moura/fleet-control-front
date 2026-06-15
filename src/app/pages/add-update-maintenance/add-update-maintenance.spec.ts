import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMaintenance } from './add-update-maintenance';

describe('AddUpdateMaintenance', () => {
  let component: AddUpdateMaintenance;
  let fixture: ComponentFixture<AddUpdateMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateMaintenance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateMaintenance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
