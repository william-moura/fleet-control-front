import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateFuel } from './add-update-fuel';

describe('AddUpdateFuel', () => {
  let component: AddUpdateFuel;
  let fixture: ComponentFixture<AddUpdateFuel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateFuel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateFuel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
