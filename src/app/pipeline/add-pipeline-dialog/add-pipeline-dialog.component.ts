import {
  AddPipeLine,
  AddStage,
  IPipeline,
  IStage,
} from './../../interfaces/pipeline/pipeline';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PipelineService } from '../../services/pipeline/pipeline.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pipeline-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule],
  templateUrl: './add-pipeline-dialog.component.html',
  styleUrl: './add-pipeline-dialog.component.css',
})
export class AddPipelineDialogComponent {
  pipelineData: AddPipeLine = {
    name: '',
    notes: '',
    stages: [{ name: '', contacts: [] } as AddStage],
    user: '',
  };
  isUpdate: boolean = false;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddPipelineDialogComponent>,
    private pipelineService: PipelineService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data) {
      console.log(data);
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
    }
  }

  addStage() {
    const stage: AddStage = {
      name: '',
      contacts: [],
    };
    this.pipelineData.stages.push(stage);
  }

  removeStage(index: number) {
    this.pipelineData.stages.splice(index, 1);
  }

  onSubmit(): void {
    this.pipelineService.createPipeline(this.pipelineData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Pipeline Created',
          text: 'Your pipeline has been created successfully!',
          confirmButtonText: 'OK',
        });
        console.log('Pipeline created successfully', response);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error creating the pipeline. Please try again.',
          confirmButtonText: 'OK',
        });
        console.error('Error creating pipeline', error);
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
