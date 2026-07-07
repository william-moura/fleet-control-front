import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNotification } from './new-notification';

describe('NewNotification', () => {
  let component: NewNotification;
  let fixture: ComponentFixture<NewNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
