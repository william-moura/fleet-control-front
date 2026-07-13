import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncSelect } from './async-select';

describe('AsyncSelect', () => {
  let component: AsyncSelect;
  let fixture: ComponentFixture<AsyncSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsyncSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
