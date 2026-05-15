import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddRole } from './form-add-role';

describe('FormAddRole', () => {
  let component: FormAddRole;
  let fixture: ComponentFixture<FormAddRole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddRole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddRole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
