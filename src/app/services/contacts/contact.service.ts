import { Contact } from './../../interfaces/contact/contact';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(
      `${this.apiUrl}/contacts`,
      this.httpOptions,
    );
  }

  getContactById(id: string): Observable<Contact> {
    return this.http.get<Contact>(
      `${this.apiUrl}/contacts/${id}`,
      this.httpOptions,
    );
  }

  getAdminContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(
      `${this.apiUrl}/admin/contacts`,
      this.httpOptions,
    );
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(
      `${this.apiUrl}/contacts/create`,
      contact,
      this.httpOptions,
    );
  }

  updateContact(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(
      `${this.apiUrl}/contacts/${id}`,
      contact,
      this.httpOptions,
    );
  }

  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/contacts/${id}`,
      this.httpOptions,
    );
  }
}
