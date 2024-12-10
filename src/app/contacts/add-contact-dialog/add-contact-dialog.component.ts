import { Contact } from './../../interfaces/contact/contact';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { ContactService } from '../../services/contacts/contact.service';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './add-contact-dialog.component.html',
  styleUrl: './add-contact-dialog.component.css',
})
export class AddContactDialogComponent {
  contactForm!: FormGroup;
  isLoading: boolean = false;
  isUpdate: boolean = false;
  contactId: string = '';
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    private fb: FormBuilder,
    private contactsService: ContactService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      notes: ['', [Validators.maxLength(5000)]],
    });
    if (data) {
      console.log(data);
      this.contactId = data?.rowItem?._id;
      this.contactForm.patchValue({
        name: data?.rowItem?.name,
        email: data?.rowItem?.email,
        phone: data?.rowItem?.phone,
        notes: data?.rowItem?.notes,
      });
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  closeDialogWithValue(): void {
    const returnValue = {
      success: true,
      message: 'Contact added successfully',
    };
    this.dialogRef.close(returnValue);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      if (!this.isUpdate) {
        this.sendContactToBackend(this.contactForm.value);
      } else {
        this.updateContact(this.contactId, this.contactForm.value);
      }
      // Submit form data to the server
    } else {
      const errors: any[] = [];
      Object.keys(this.contactForm.controls).forEach((key) => {
        const controlErrors = this.contactForm.get(key)?.errors;
        console.log(controlErrors);

        if (controlErrors != null) {
          Object.keys(controlErrors).forEach((keyError) => {
            errors.push(key);
            console.log(
              'Key control: ' +
                key +
                ', keyError: ' +
                keyError +
                ', errorValue: ',
              controlErrors[keyError],
            );
          });
        }
      });
      const formattedErrors = errors
        .map((error) => `<span class="text-error">${error}</span>`)
        .join('<br>');

      Swal.fire({
        title: 'Invalid Entries',
        html: `These fields are not valid:<br>${formattedErrors}`,
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  }

  sendContactToBackend(data: Contact) {
    this.isLoading = true;
    this.contactsService.createContact(data).subscribe(
      (response: any) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Success',
          text: `Success: Contact Added Successfully`,
          icon: 'success',
          confirmButtonText: 'Okay',
          timer: 2000,
        });
        this.closeDialogWithValue();
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

  updateContact(id: string, body: Contact) {
    console.log('exe');

    this.isLoading = true;
    this.contactsService.updateContact(id, body).subscribe(
      (response: any) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Success',
          text: `Success: Contact Updated Successfully`,
          icon: 'success',
          confirmButtonText: 'Okay',
          timer: 2000,
        });
        this.closeDialogWithValue();
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
}
