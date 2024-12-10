import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AgoraTokenService } from '../../services/agoraToken/agora-token.service';
import { AgoraService } from '../agoraServices/agora-service.service';
import { ContactService } from '../../services/contacts/contact.service';
import { Contact } from '../../interfaces/contact/contact';
import Swal from 'sweetalert2';
import { IAgoraRTCRemoteUser} from 'agora-rtc-sdk-ng';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-videocall',
  standalone: true,
  imports: [],
  templateUrl: './videocall.component.html',
  styleUrl: './videocall.component.css'
})
export class VideocallComponent implements OnInit {
isVideoCallStarted:boolean = false;
isLoading:boolean = false;
contacts: Contact[] = [];
localUid:number =0
remoteUsers:any[] = [];
remoteUsers$: Observable<IAgoraRTCRemoteUser[]>;
token:string="";
channelName:string = ""
constructor(
  private tokenService: AgoraTokenService,
  private agoraService: AgoraService,private contactsService: ContactService) {
    this.remoteUsers$ = this.agoraService.remoteUsers$;
  }

  ngOnInit(): void {
    this.remoteUsers$.subscribe(users => {
      console.log(users,'remoteUsers subscribr');

      users.forEach(user => {
        // Initialize videoEnabled state for each user
        if (!this.remoteUsers.find(existingUser => existingUser.uid === user.uid)) {
          this.remoteUsers.push(user);
        }
        const elementId = `remote-video-${user.uid}`;
        console.log(`Element should be created with ID: ${elementId}`);
      });

      console.log(this.remoteUsers, 'private remote users');
    });
  }


rtc={
  localAudioTrack: null,
  client: null,
}

options = {
  appId: environment.AppId, // Your app ID
  channel: "demo",      // Channel name
  token: "Your temp tok", // Temp token
  uid: 123456,          // User ID
}

createMeeting(channelName: string, uid: number) {
  this.tokenService.generateToken(channelName, uid).subscribe(
    (response) => {
      const token = response.token;
      console.log('Token:', token);
      this.token = token
      this.channelName=channelName;
      this.joinAgoraChannel(channelName, token, uid);
    },
    (error) => {
      console.error('Failed to generate token:', error);
    }
  );
}

async joinAgoraChannel(channelName: string, token: string, uid: number): Promise<void> {
  try {
    await this.agoraService.joinChannel(this.options.appId, channelName, token, uid);
    this.localUid=uid
    const localVideoTrack = this.agoraService.getLocalVideoTrack();

    if (localVideoTrack) {
      this.isVideoCallStarted = true;
      setTimeout(() => {
        const localVideoElement = document.getElementById(`local-video-${this.localUid}`);
        if (localVideoElement) {
          // localVideoElement.style.objectFit='contain !important'
          localVideoTrack.play(localVideoElement,{
            fit: 'contain',
            mirror: true
          });
        } else {
          console.warn(`Element with id local-video-${uid} not found.`);
        }
      }, 0);
    }
  } catch (error) {
    console.error('Failed to join the channel:', error);
  }
}


getContactfromBackend() {
  this.isLoading = true;
  this.contactsService.getContacts().subscribe(
    (response: any) => {
      this.isLoading = false;
      this.contacts = response?.filteredContacts;
     // console.log(this.contacts, 'contacts');
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

leaveMeeting(){

}

trackByFn(index: number, user: IAgoraRTCRemoteUser): any {
  return user.uid;
}

toggleVideo(user: IAgoraRTCRemoteUser) {
  this.agoraService.muteRemoteVideo(this.options.appId,this.channelName,this.token,Number(user.uid),user,true)
}

toggleCameraLocal(){
  this.agoraService.toggleCamera()
}

muteRemoteUser(user:IAgoraRTCRemoteUser){
  this.agoraService.muteRemoteAudio(user,true)
}


}
