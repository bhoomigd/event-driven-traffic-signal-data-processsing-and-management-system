import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongestionRuleModalComponent } from './congestion-rule-modal-component';

describe('CongestionRuleModalComponent', () => {
  let component: CongestionRuleModalComponent;
  let fixture: ComponentFixture<CongestionRuleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongestionRuleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongestionRuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
