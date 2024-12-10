import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToPipelineDialogComponent } from './add-to-pipeline-dialog.component';

describe('AddToPipelineDialogComponent', () => {
  let component: AddToPipelineDialogComponent;
  let fixture: ComponentFixture<AddToPipelineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToPipelineDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToPipelineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
