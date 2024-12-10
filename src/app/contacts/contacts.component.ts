import { Component, OnInit } from '@angular/core';
import { SearchContactsComponent } from './search-contacts/search-contacts.component';
import { TableComponent } from '../utils/table/table.component';
import { AddContactDialogComponent } from './add-contact-dialog/add-contact-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Contact } from '../interfaces/contact/contact';
import { ContactService } from '../services/contacts/contact.service';
import Swal from 'sweetalert2';
import { TableActions } from '../interfaces/tableActions/actions';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddToPipelineDialogComponent } from './add-to-pipeline-dialog/add-to-pipeline-dialog.component';
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    SearchContactsComponent,
    TableComponent,
    MatDialogModule,
    MatProgressBarModule,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  checkedContacts: Contact[] = [];
  constructor(
    public dialog: MatDialog,
    private contactsService: ContactService,
  ) {}
  ngOnInit(): void {
    this.getContactfromBackend();
  }
  isLoading: boolean = false;
  isActionLoading: boolean = false;
  actions: TableActions[] = [
    {
      iconName: 'fa-solid fa-pen',
      action: (rowItem: Contact) => this.handleEdit(rowItem),
      name: 'Edit',
      buttonColor: 'bg-blue-500',
    },
    {
      iconName: 'fa-solid fa-trash',
      action: (rowItem: Contact) => this.handleDelete(rowItem),
      name: 'Delete',
      buttonColor: 'bg-red-600',
    },
  ];

  openDialog(): void {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: 'auto',
      height: 'fit',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Perform actions after the dialog is closed
      if (result) {
        this.getContactfromBackend();
      } else {
        console.log('Dialog was closed without any result');
      }
    });
  }

  getContactfromBackend() {
    this.isLoading = true;
    this.contactsService.getContacts().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.contacts = response?.filteredContacts;
        console.log(this.contacts, 'contacts');
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

  openEditDialog(rowItem: any) {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: 'auto',
      height: 'fit',
      data: {
        // Pass any data you want here
        rowItem,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getContactfromBackend();
      } else {
        console.log('Dialog was closed without any result');
      }
    });
  }

  handleEdit(rowItem: any) {
    this.openEditDialog(rowItem);
  }

  handleDelete(rowItem: any) {
    const contactId = rowItem._id;

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
        this.contactsService.deleteContact(contactId).subscribe({
          next: () => {
            this.isActionLoading = false;
            Swal.fire('Deleted!', 'The contact has been deleted.', 'success');
            this.getContactfromBackend();
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

  onCheckboxChange(checkedItems: Contact[]): void {
    if (
      checkedItems &&
      Array.isArray(checkedItems) &&
      checkedItems.length > 0
    ) {
      this.checkedContacts = checkedItems;
    } else {
      this.checkedContacts = [];
    }
  }

  openAddToPipelineDialog() {
    const dialogRef = this.dialog.open(AddToPipelineDialogComponent, {
      width: 'auto',
      height: 'fit',
      data: this.checkedContacts,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Perform actions after the dialog is closed
      if (result) {
        this.getContactfromBackend();
      } else {
        console.log('Dialog was closed without any result');
      }
    });
  }
}
