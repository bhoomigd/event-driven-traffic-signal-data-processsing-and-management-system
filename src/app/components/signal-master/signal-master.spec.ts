import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalMaster } from './signal-master';

describe('SignalMaster', () => {
  let component: SignalMaster;
  let fixture: ComponentFixture<SignalMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
