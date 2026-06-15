import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSupplier } from './add-update-supplier';

describe('AddUpdateSupplier', () => {
  let component: AddUpdateSupplier;
  let fixture: ComponentFixture<AddUpdateSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
