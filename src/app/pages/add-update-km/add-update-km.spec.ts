import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateKm } from './add-update-km';

describe('AddUpdateKm', () => {
  let component: AddUpdateKm;
  let fixture: ComponentFixture<AddUpdateKm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateKm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateKm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
