import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePrefeitura } from './add-update-prefeitura';

describe('AddUpdatePrefeitura', () => {
  let component: AddUpdatePrefeitura;
  let fixture: ComponentFixture<AddUpdatePrefeitura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdatePrefeitura]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdatePrefeitura);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
