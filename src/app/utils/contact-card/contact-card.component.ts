import { Component, Input } from '@angular/core';
import { Contact } from '../../interfaces/contact/contact';

@Component({
  selector: 'app-contact-card',
  standalone: true,
  imports: [],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.css',
})
export class ContactCardComponent {
  @Input() Contact!: Contact;


  openWhatsApp(phone:string){
    window.location.href=`https://wa.me/${phone}?text=Hello%20`
  }
}
