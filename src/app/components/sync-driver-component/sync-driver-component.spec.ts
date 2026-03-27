import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncDriverComponent } from './sync-driver-component';

describe('SyncDriverComponent', () => {
  let component: SyncDriverComponent;
  let fixture: ComponentFixture<SyncDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncDriverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
