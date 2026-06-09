import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('Button', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default label as "Button"', () => {
    expect(component.label).toBe('Button');
  });

  it('should have default buttonClass as "primary"', () => {
    expect(component.buttonClass).toBe('primary');
  });

  it('should log message when handleClick is called', () => {
    spyOn(console, 'log');
    component.handleClick();
    expect(console.log).toHaveBeenCalledWith('Button clicked!');
  });

  it('should display the label in the template', () => {
    component.label = 'Test Button';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.textContent).toContain('Test Button');
  });
});
