import { Injectable } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgoraService {
  private client: IAgoraRTCClient;

  // Tracks for local media
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private localVideoTrack: ICameraVideoTrack | null = null;

  // BehaviorSubjects for reactive updates
  private remoteUsersSubject = new BehaviorSubject<IAgoraRTCRemoteUser[]>([]);
  private connectionStateSubject = new BehaviorSubject<string>('DISCONNECTED');

  // Observables for components to subscribe
  remoteUsers$: Observable<IAgoraRTCRemoteUser[]> = this.remoteUsersSubject.asObservable();
  connectionState$: Observable<string> = this.connectionStateSubject.asObservable();

  constructor() {
    this.client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp9',

    });

    this.setupEventListeners();
  }

   setupEventListeners(): void {
    // Remote user publishes media
    this.client.on('user-published', async (user, mediaType) => {
      console.log('user published');

      try {
        await this.client.subscribe(user, mediaType);

        const currentUsers = this.remoteUsersSubject.value;
        if (!currentUsers.some(u => u.uid === user.uid)) {
          const updatedUsers = [...currentUsers, user];
          this.remoteUsersSubject.next(updatedUsers);
        }

        if (mediaType === 'video') {
          setTimeout(() => {
            this.playRemoteVideo(user);
          }, 500);
        }

        if (mediaType === 'audio') {
          console.log('is audio');
          
          user.audioTrack?.play();
          //user.audioTrack?.setVolume(100)
        }
      } catch (error) {
        console.error('Failed to subscribe to user:', error);
      }
    });

    // Remote user stops publishing
    this.client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        const updatedUsers = this.remoteUsersSubject.value.filter(
          remoteUser => remoteUser.uid !== user.uid
        );
        this.remoteUsersSubject.next(updatedUsers);
      }
    });

    // Connection state changes
    this.client.on('connection-state-change', (curState, prevState, reason) => {
      this.connectionStateSubject.next(curState);
      console.log(`Connection changed from ${prevState} to ${curState}`);
    });

    // User joins
    this.client.on('user-joined', (user) => {
      console.log(`User ${user.uid} joined the channel`);
    });

    // User leaves
    this.client.on('user-left', (user, reason) => {
      console.log(`User ${user.uid} left the channel. Reason: ${reason}`);

      const updatedUsers = this.remoteUsersSubject.value.filter(
        remoteUser => remoteUser.uid !== user.uid
      );
      this.remoteUsersSubject.next(updatedUsers);
    });
  }

  // Join a channel
  async joinChannel(appId: string, channelName: string, token: string | null = null, uid: number): Promise<number> {
    try {
      if (this.client.connectionState === 'CONNECTED') {
        await this.client.leave();
      }
  
      // Join the channel
      await this.client.join(appId, channelName, token, uid);
  
      // Create the audio track using await

  
      // Create the video track
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: {
          sampleRate: 48000,
          stereo: true,
          bitrate: 128
        },
      });
  
      this.localAudioTrack.setVolume(100);
      // Log track creation status
      console.log('Local audio track created:', this.localAudioTrack);
      console.log('Local video track created:', this.localVideoTrack);
  
      // Publish local tracks
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
  
      // Log publishing status
      console.log('Local tracks published successfully');
  
      return uid;
    } catch (error) {
      console.error('Error joining channel:', error);
      throw error;
    }
  }
  

  async muteRemoteAudio(user:IAgoraRTCRemoteUser, mute: boolean): Promise<void> {
    try {
 
         user.audioTrack?.setVolume(0)
        console.log(`Remote audio for user ${user.uid} ${mute ? 'muted' : 'unmuted'}`);
      } 
     catch (error:any) {
      console.error('Error muting remote audio:', error);
    }
  }
  

  async joinChannelWithoutAudioOrVideo(
    appId: string,
    channelName: string,
    token: string | null = null,
    uid: number,
    enableVideo: boolean
  ): Promise<number> {
    try {
      // Join the channel
      await this.client.join(appId, channelName, token, uid);

      // Create local audio track
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      if (!enableVideo) {
        console.log('disbled video');

        await this.client.publish([this.localAudioTrack]);
      } else {
        this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
      }

      return uid;
    } catch (error) {
      console.error('Error joining channel:', error);
      throw error;
    }
  }

  // Leave the channel
  async leaveChannel(): Promise<void> {
    try {
      // Close local tracks
      this.localAudioTrack?.close();
      this.localVideoTrack?.close();

      // Leave the channel
      await this.client.leave();

      // Reset remote users
      this.remoteUsersSubject.next([]);
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  }

  // Toggle microphone
  async toggleMicrophone(): Promise<boolean> {
    if (!this.localAudioTrack) return false;

    const enabled = !this.localAudioTrack.enabled;
    await this.localAudioTrack.setEnabled(enabled);
    return enabled;
  }

  // Toggle camera
  async toggleCamera(): Promise<boolean> {
    if (!this.localVideoTrack) return false;

    const enabled = !this.localVideoTrack.enabled;
    await this.localVideoTrack.setEnabled(enabled);
    return enabled;
  }

  // Get local video track for rendering
  getLocalVideoTrack(): ICameraVideoTrack | null {
    return this.localVideoTrack;
  }

  playRemoteVideo(user: IAgoraRTCRemoteUser, retries: number = 5): void {
    const elementId = `remote-user-${user.uid}`;
    const element = document.getElementById(elementId);

    if (element) {
      user.videoTrack?.play(elementId);
    } else if (retries > 0) {
      setTimeout(() => {
        this.playRemoteVideo(user, retries - 1);
      }, 1000);
    } else {
      console.warn(`Element with id ${elementId} not found after multiple retries.`);
    }
  }

  async muteRemoteVideo(
    appId: string,
    channelName: string,
    token: string | null = null,
    uid: number,
    user: IAgoraRTCRemoteUser,
    mute: boolean
  ): Promise<void> {
    try {
      if (user && user.videoTrack) {
        if (mute) {
          await this.client.unsubscribe(user);

          // Rejoin the channel without video
          await this.joinChannelWithoutAudioOrVideo(
            appId,
            channelName,
            token,
            uid,
            false
          );
        } else {
          this.playRemoteVideo(user);
        }

        console.log(`Remote video for user ${user.uid} ${mute ? 'muted' : 'unmuted'}`);
      } else {
        console.warn('Cannot mute remote video: No video track found');
      }
    } catch (error) {
      console.error('Error muting remote video:', error);
    }
  }


}
