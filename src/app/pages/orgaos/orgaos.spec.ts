import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orgaos } from './orgaos';

describe('Orgaos', () => {
  let component: Orgaos;
  let fixture: ComponentFixture<Orgaos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orgaos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orgaos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
