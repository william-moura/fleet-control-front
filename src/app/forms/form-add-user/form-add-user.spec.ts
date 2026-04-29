import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddUser } from './form-add-user';

describe('FormAddUser', () => {
  let component: FormAddUser;
  let fixture: ComponentFixture<FormAddUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
