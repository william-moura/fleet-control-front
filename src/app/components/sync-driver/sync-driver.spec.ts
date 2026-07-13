import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncDriver } from './sync-driver';

describe('SyncDriver', () => {
  let component: SyncDriver;
  let fixture: ComponentFixture<SyncDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncDriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncDriver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
