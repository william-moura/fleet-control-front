import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateUsers } from './add-update-users';

describe('AddUpdateUsers', () => {
  let component: AddUpdateUsers;
  let fixture: ComponentFixture<AddUpdateUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
