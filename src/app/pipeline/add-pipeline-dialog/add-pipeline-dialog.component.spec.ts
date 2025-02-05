import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPipelineDialogComponent } from './add-pipeline-dialog.component';

describe('AddPipelineDialogComponent', () => {
  let component: AddPipelineDialogComponent;
  let fixture: ComponentFixture<AddPipelineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPipelineDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPipelineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
