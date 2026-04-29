import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddKmComponent } from './form-add-km-component';

describe('FormAddKmComponent', () => {
  let component: FormAddKmComponent;
  let fixture: ComponentFixture<FormAddKmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddKmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
