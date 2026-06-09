import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';
import { By } from '@angular/platform-browser';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isChecked property when toggleSwitch is called', () => {
    component.isChecked = false;
    component.toggleSwitch();
    expect(component.isChecked).toBeTrue();

    component.toggleSwitch();
    expect(component.isChecked).toBeFalse();
  });

  it('should emit change event with the correct value when toggleSwitch is called', () => {
    spyOn(component.change, 'emit');

    component.toggleSwitch();
    expect(component.change.emit).toHaveBeenCalledWith(true);

    component.toggleSwitch();
    expect(component.change.emit).toHaveBeenCalledWith(false);
  });

  it('should reflect the isChecked state in the template', () => {
    component.isChecked = true;
    fixture.detectChanges();
    const switchElement = fixture.debugElement.query(By.css('.switch'));
    expect(switchElement.classes['checked']).toBeTrue();

    component.isChecked = false;
    fixture.detectChanges();
    expect(switchElement.classes['checked']).toBeUndefined();
  });
});
