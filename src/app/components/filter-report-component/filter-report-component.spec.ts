import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterReportComponent } from './filter-report-component';

describe('FilterReportComponent', () => {
  let component: FilterReportComponent;
  let fixture: ComponentFixture<FilterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
