import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFuelSuppliers } from './list-fuel-suppliers';

describe('ListFuelSuppliers', () => {
  let component: ListFuelSuppliers;
  let fixture: ComponentFixture<ListFuelSuppliers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFuelSuppliers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFuelSuppliers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
