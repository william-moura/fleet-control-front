import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSecretaria } from './add-update-secretaria';

describe('AddUpdateSecretaria', () => {
  let component: AddUpdateSecretaria;
  let fixture: ComponentFixture<AddUpdateSecretaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateSecretaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateSecretaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
