import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SearchContactsComponent } from '../../contacts/search-contacts/search-contacts.component';
import { PipelineService } from '../../services/pipeline/pipeline.service';
import { ActivatedRoute } from '@angular/router';
import { IPipeline, IStage } from '../../interfaces/pipeline/pipeline';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ContactCardComponent } from '../../utils/contact-card/contact-card.component';
import { Contact } from '../../interfaces/contact/contact';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-pipeline-view',
  standalone: true,
  imports: [
    SearchContactsComponent,
    CdkDropList,
    CdkDrag,
    ContactCardComponent,
  ],
  templateUrl: './pipeline-view.component.html',
  styleUrl: './pipeline-view.component.css',
})
export class PipelineViewComponent implements OnInit, AfterViewInit {
  pipeline?: IPipeline;
  isPipelineLoading: boolean = false;
  constructor(
    private pipelineService: PipelineService,
    private route: ActivatedRoute,
    public _snackBar: MatSnackBar,
  ) {}
  ngAfterViewInit(): void {
    // console.log(this.connectedDropLists);
    // this.connectedDropLists
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const pipelineId = params['id'];
      if (pipelineId) {
        this.getPipeline(pipelineId);
      }
    });
  }

  getPipeline(id: string): void {
    this.isPipelineLoading = true;
    this.pipelineService.getPipelineById(id).subscribe({
      next: (data: any) => {
        this.isPipelineLoading = false;
        this.pipeline = data.PipelineById;
        console.log(this.pipeline, 'pipeline');
      },
      error: (error) => {
        this.isPipelineLoading = false;
        console.error('Error fetching pipeline:', error);
      },
    });
  }

  trackByIndex(index: number, item: any): number {
    return item._id;
  }

  get connectedDropLists(): string[] {
    if (this.pipeline) {
      // console.log(
      //   this.pipeline.stages.map((_, index) => `cdk-drop-list-${index}`),
      // );

      return this.pipeline.stages.map((_, index) => `cdk-drop-list-${index}`);
    }
    return [''];
  }

  trackByItem(index: number, item: Contact): any {
    return (item?._id ?? 'no-id') + index;
  }
  drop(event: CdkDragDrop<Contact[]>) {
    //console.log(event);

    if (event.previousContainer === event.container) {
      console.log('in the container');

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.checkAndUpdateStage(event);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      if (this.pipeline?._id) {
        this.updateStage(this.pipeline?._id, this.pipeline?.stages);
      }
    }
  }

  checkAndUpdateStage(event: CdkDragDrop<Contact[]>) {
    if (event.previousIndex !== event.currentIndex) {
      if (this.pipeline?._id && this.pipeline.stages) {
        this.updateStage(this.pipeline?._id, this.pipeline?.stages);
      }
    }
  }

  updateStage(pipelineId: string, updates: IStage[]): void {
    const loadingSnack = this._snackBar.open('Loading...', '', {
      duration: undefined,
      verticalPosition: 'top',
    });
    const toBeUpdated = updates;
    console.log(toBeUpdated);

    this.pipelineService.updatePipelineStage(pipelineId, toBeUpdated).subscribe(
      (response) => {
        loadingSnack.dismiss();
        this._snackBar.open('Updated successfully', '', {
          duration: 3000,
          verticalPosition: 'top',
        });
        console.log('Stage updated successfully', response);
      },
      (error) => {
        loadingSnack.dismiss();
        this._snackBar.open('Error updating stage', '', {
          duration: 3000,
          verticalPosition: 'top',
        });
        console.error('Error updating stage', error);
      },
    );
  }
}
