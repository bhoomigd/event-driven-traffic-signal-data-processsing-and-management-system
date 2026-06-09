import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileModal } from './upload-file-modal';

describe('UploadFileModal', () => {
  let component: UploadFileModal;
  let fixture: ComponentFixture<UploadFileModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFileModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFileModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
