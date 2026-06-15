import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDriverFine } from './list-driver-fine';

describe('ListDriverFine', () => {
  let component: ListDriverFine;
  let fixture: ComponentFixture<ListDriverFine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDriverFine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDriverFine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
