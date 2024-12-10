import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineViewComponent } from './pipeline-view.component';

describe('PipelineViewComponent', () => {
  let component: PipelineViewComponent;
  let fixture: ComponentFixture<PipelineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PipelineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
