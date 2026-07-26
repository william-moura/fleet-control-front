import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prefeituras } from './prefeituras';

describe('Prefeituras', () => {
  let component: Prefeituras;
  let fixture: ComponentFixture<Prefeituras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prefeituras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prefeituras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
