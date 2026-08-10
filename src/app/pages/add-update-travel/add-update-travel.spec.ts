import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AddUpdateTravel } from './add-update-travel';

describe('AddUpdateTravel', () => {
  let component: AddUpdateTravel;
  let fixture: ComponentFixture<AddUpdateTravel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateTravel],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateTravel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
