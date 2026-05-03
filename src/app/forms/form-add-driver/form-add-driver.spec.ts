import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddDriver } from './form-add-driver';

describe('FormAddDriver', () => {
  let component: FormAddDriver;
  let fixture: ComponentFixture<FormAddDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddDriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddDriver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
