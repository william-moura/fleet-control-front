import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secretarias } from './secretarias';

describe('Secretarias', () => {
  let component: Secretarias;
  let fixture: ComponentFixture<Secretarias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Secretarias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Secretarias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
