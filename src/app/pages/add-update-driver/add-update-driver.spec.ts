import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDriver } from './add-update-driver';

describe('AddUpdateDriver', () => {
  let component: AddUpdateDriver;
  let fixture: ComponentFixture<AddUpdateDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateDriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateDriver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
