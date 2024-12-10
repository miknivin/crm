import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableActions } from '../../interfaces/tableActions/actions';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() dataFromParent: any;
  @Input() dataToShow!: any[];
  @Input() isAvatar: boolean = false;
  @Input() actions: TableActions[] = [];
  @Output() checkboxChange = new EventEmitter<any[]>();
  tableItems: any[] = [];
  checkedItems: any[] = [];
  ngOnInit() {
    this.tableItems = this.filterItems(this.dataFromParent, this.dataToShow);
    //console.log(this.tableItems,'fromparent');
  }

  filterItems(contacts: any[], dataToShow: string[]): any[] {
    return contacts.map((contact) => {
      let filteredContact: any = {};
      dataToShow.forEach((key) => {
        if (contact.hasOwnProperty(key)) {
          filteredContact[key] = contact[key];
        }
      });
      return filteredContact;
    });
  }

  capitalizeFirstLetter(items: string): string {
    return items.charAt(0).toUpperCase() + items.slice(1).toLowerCase();
  }

  getItemIndex(index: number): number {
    if (index > this.dataToShow.length) {
      return this.dataToShow.length;
    }
    return this.dataToShow.length - (this.dataToShow.length - index);
  }

  onCheckboxChange(event: Event, item: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.checkedItems.push(item);
    } else {
      this.checkedItems = this.checkedItems.filter(
        (checkedItem) => checkedItem !== item,
      );
    }
    this.checkboxChange.emit(this.checkedItems);
  }
}
