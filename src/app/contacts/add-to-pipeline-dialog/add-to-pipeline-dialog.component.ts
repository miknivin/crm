import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PipelineService } from '../../services/pipeline/pipeline.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import {
  IContact,
  IPipeline,
  IStage,
} from '../../interfaces/pipeline/pipeline';

@Component({
  selector: 'app-add-to-pipeline-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule],
  templateUrl: './add-to-pipeline-dialog.component.html',
  styleUrl: './add-to-pipeline-dialog.component.css',
})
export class AddToPipelineDialogComponent implements OnInit {
  pipelines: IPipeline[] = [];
  pipelineStages: IStage[] = [];
  selectedPipeline: IPipeline = {
    name: '',
    stages: [],
    notes: '',
    _id: '',
    user: '',
  };
  selectedStage: IStage = { _id: '', name: '', contacts: [] };
  selectedContacts: IContact[] = [];
  isDropDown: boolean = false;
  isPipelineStageDropDown = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddToPipelineDialogComponent>,
    private pipelineService: PipelineService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.selectedContacts = data;
    console.log(this.selectedContacts, 'from parentt');
  }
  ngOnInit(): void {
    this.getPipelines();
  }

  onSubmit() {
    // Ensure both selectedPipeline and selectedStage are defined
    if (!this.isPipelineAndStageValid()) {
      return;
    }
    // Ensure selectedPipeline._id is a string
    const pipelineId = this.selectedPipeline._id;
    if (typeof pipelineId !== 'string') {
      console.error('Pipeline ID is not valid');
      return;
    }

    console.log('Updating pipeline:', this.selectedPipeline);

    this.pipelineService
      .updatePipelineById(pipelineId, this.selectedPipeline)
      .subscribe(
        (updatedPipeline: IPipeline) => {
          console.log('Pipeline updated successfully', updatedPipeline);

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Pipeline updated successfully',
          });
          this.closeDialog();
        },
        (error) => {
          console.error('Error updating pipeline', error);

          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred while updating the pipeline.',
          });
        },
      );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getPipelines() {
    this.pipelineService.getPipelines().subscribe({
      next: (response: any) => {
        this.pipelines = response.filteredPipelines;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error getting the pipelines. Please try again.',
          confirmButtonText: 'OK',
        });
        console.error('Error creating pipeline', error);
      },
    });
  }

  openDropDown() {
    this.isDropDown = !this.isDropDown;
    console.log(this.isDropDown);
  }

  setPipeLine(pipeline: IPipeline) {
    this.selectedPipeline = pipeline;
    this.pipelineStages = pipeline.stages;
    if (this.pipelineStages) {
      this.isDropDown = !this.isDropDown;
    }
  }

  openPipelineStageDropDown() {
    this.isPipelineStageDropDown = !this.isPipelineStageDropDown;
  }

  initializeStageContacts(stage: any): void {
    stage.contacts = stage.contacts || [];
  }

  updateContactStage(contact: any, stage: any, pipelineStages: any[]): boolean {
    let contactFoundInStage = false;

    pipelineStages.forEach((pipelineStage: any) => {
      const contactIndex = pipelineStage.contacts.findIndex(
        (existingContact: any) => existingContact === contact._id,
      );

      if (contactIndex !== -1) {
        // Contact found in the pipeline stage, update the stage
        pipelineStage.contacts.splice(contactIndex, 1);
        stage.contacts.push({ _id: contact._id });
        contactFoundInStage = true;
      }
    });

    // If the contact was not found in any stages, add it to the specified stage
    if (!contactFoundInStage) {
      stage.contacts.push({ _id: contact._id });
    }

    return contactFoundInStage;
  }

  setPipelineStage(stage: any): void {
    this.initializeStageContacts(stage);

    this.selectedContacts.forEach((contact: any) => {
      if (contact?._id) {
        this.updateContactStage(contact, stage, this.selectedPipeline.stages);
      }
    });
    this.updatePipelineStage(stage, this.selectedPipeline);
    this.selectedStage = stage;
    this.isPipelineStageDropDown = !this.isPipelineStageDropDown;
    console.log(this.selectedStage, 'stage');
    console.log(this.selectedPipeline, 'pipeline');
  }

  updatePipelineStage(stage: any, selectedPipeline: any): void {
    const stageIndex = selectedPipeline.stages.findIndex(
      (s: any) => s._id === stage._id,
    );

    if (stageIndex !== -1) {
      selectedPipeline.stages[stageIndex] = stage;
    } else {
      selectedPipeline.stages.push(stage);
    }
  }

  isPipelineAndStageValid(): boolean {
    if (!this.selectedPipeline || !this.selectedStage) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Pipeline or Stage is not selected',
      });
      return false;
    }

    const pipelineId = this.selectedPipeline._id;
    if (typeof pipelineId !== 'string') {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Pipeline ID is not valid',
      });
      return false;
    }

    return true;
  }
}
