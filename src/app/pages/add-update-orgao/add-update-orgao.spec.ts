import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateOrgao } from './add-update-orgao';

describe('AddUpdateOrgao', () => {
  let component: AddUpdateOrgao;
  let fixture: ComponentFixture<AddUpdateOrgao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateOrgao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateOrgao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
