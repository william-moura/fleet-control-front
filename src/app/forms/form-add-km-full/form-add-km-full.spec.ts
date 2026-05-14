import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddKmFull } from './form-add-km-full';

describe('FormAddKmFull', () => {
  let component: FormAddKmFull;
  let fixture: ComponentFixture<FormAddKmFull>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddKmFull]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddKmFull);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
