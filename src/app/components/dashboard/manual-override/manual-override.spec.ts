import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualOverride } from './manual-override';

describe('ManualOverride', () => {
  let component: ManualOverride;
  let fixture: ComponentFixture<ManualOverride>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualOverride]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualOverride);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
