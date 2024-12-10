import { Component, OnInit } from '@angular/core';
import { SearchContactsComponent } from '../contacts/search-contacts/search-contacts.component';
import { MatDialog } from '@angular/material/dialog';
import { ContactService } from '../services/contacts/contact.service';
import { AddPipelineDialogComponent } from './add-pipeline-dialog/add-pipeline-dialog.component';
import { IPipeline } from '../interfaces/pipeline/pipeline';
import Swal from 'sweetalert2';
import { PipelineService } from '../services/pipeline/pipeline.service';
import { TableComponent } from '../utils/table/table.component';
import { TableActions } from '../interfaces/tableActions/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [SearchContactsComponent, TableComponent],
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.css',
})
export class PipelineComponent implements OnInit {
  isLoading: boolean = false;
  pipelines: IPipeline[] = [];
  transformedPipelines: any[] = [];
  isActionLoading: boolean = false;
  constructor(
    public dialog: MatDialog,
    private pipelineService: PipelineService,
    private router: Router,
  ) {}
  actions: TableActions[] = [
    {
      iconName: 'fa-solid fa-pen',
      action: (rowItem: IPipeline) => this.handleEdit(rowItem),
      name: 'Edit',
      buttonColor: 'bg-blue-500 hover:bg-blue-500/80',
    },
    {
      iconName: 'fa-solid fa-eye',
      action: (rowItem: IPipeline) => this.handleView(rowItem),
      name: 'View',
      buttonColor: 'bg-blue-500 hover:bg-blue-500/80',
    },
    {
      iconName: 'fa-solid fa-trash',
      action: (rowItem: IPipeline) => this.handleDelete(rowItem),
      name: 'Delete',
      buttonColor: 'bg-red-600 hover:bg-red-500/80',
    },
  ];
  ngOnInit() {
    this.getPipelinesfromBackend();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddPipelineDialogComponent, {
      width: 'auto',
      height: 'fit',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      } else {
      }
    });
  }

  getPipelinesfromBackend() {
    this.isLoading = true;
    this.pipelineService.getPipelines().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.pipelines = response?.filteredPipelines;
        this.transformedPipelines = response?.filteredPipelines.map(
          (pipeline: any) => ({
            ...pipeline,
            Stages: pipeline.stages.map((stage: any) => stage.name).join(', '),
          }),
        );
        console.log(this.transformedPipelines, 'transformedPipelines');
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Alert',
          text: `Error Submitting: ${error?.message}`,
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      },
    );
  }

  handleEdit(rowItem: any) {
    this.openEditDialog(rowItem);
  }

  handleView(rowItem: any) {
    const pipelineId = rowItem._id;
    this.router.navigate(['dashboard/pipeline-view', `${pipelineId}`]);
  }

  handleDelete(rowItem: any) {
    const pipelineId = rowItem._id;

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the contact: ${rowItem.name}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: this.getSwalPopupClass(),
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.isActionLoading = true;
        this.pipelineService.deletePipeline(pipelineId).subscribe({
          next: () => {
            this.isActionLoading = false;
            Swal.fire('Deleted!', 'The pipeline has been deleted.', 'success');
            this.getPipelinesfromBackend();
          },
          error: () => {
            this.isActionLoading = false;
            Swal.fire(
              'Error!',
              'There was a problem deleting the contact.',
              'error',
            );
          },
        });
      }
    });
  }

  getSwalPopupClass(): string {
    // Assuming you're using Tailwind CSS classes for light and dark modes
    const baseClass = 'bg-base-300 text-gray-200';
    const darkClass = 'dark:text-gray-200'; // Adjust this class based on your dark mode setup

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? `${baseClass} ${darkClass}`
      : baseClass;
  }

  openEditDialog(rowItem: any) {
    const dialogRef = this.dialog.open(AddPipelineDialogComponent, {
      width: 'auto',
      height: 'fit',
      data: {
        // Pass any data you want here
        rowItem,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPipelinesfromBackend();
      } else {
        console.log('Dialog was closed without any result');
      }
    });
  }

  onCheckboxChange(checkedItems: any[]): void {
    console.log('Checked items:', checkedItems);
  }
}
