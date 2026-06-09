import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongestionLevels } from './congestion-levels';

describe('CongestionLevels', () => {
  let component: CongestionLevels;
  let fixture: ComponentFixture<CongestionLevels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongestionLevels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongestionLevels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
