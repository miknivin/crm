import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgoraTokenService {
  private apiUrl = 'http://localhost:8080/api/v1';
  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) {}

  generateToken(channelName: string, uid: number): Observable<any> {
    const body = {channelName, uid}
    return this.http.post(`${this.apiUrl}/generate-agora-token`, body, this.httpOptions);
  }


}
