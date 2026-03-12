import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmComponent } from './km-component';

describe('KmComponent', () => {
  let component: KmComponent;
  let fixture: ComponentFixture<KmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
