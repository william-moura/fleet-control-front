import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMaintenance } from './list-maintenance';

describe('ListMaintenance', () => {
  let component: ListMaintenance;
  let fixture: ComponentFixture<ListMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMaintenance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMaintenance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
