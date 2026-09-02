import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncSecretarias } from './sync-secretarias';

describe('SyncSecretarias', () => {
  let component: SyncSecretarias;
  let fixture: ComponentFixture<SyncSecretarias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncSecretarias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncSecretarias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
