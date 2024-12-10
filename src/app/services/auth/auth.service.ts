import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1'; // Adjust the base URL as necessary

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  googleSignin(fbKey: string, userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/${fbKey}`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData);
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/forgot`, { email });
  }

  resetPassword(token: string, passwordData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/password/reset/${token}`,
      passwordData,
    );
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { withCredentials: true });
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/update`, profileData);
  }

  updatePassword(passwordData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/password/update`, passwordData);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`);
  }

  getUserDetails(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users/${userId}`);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
  }

  uploadAvatar(avatarData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/upload_avatar`, avatarData);
  }

  isAuthenticated(): Observable<boolean> {
    return this.getUserProfile().pipe(
      tap((user) =>
        console.log('User Profile:' + JSON.stringify(user, null, 2)),
      ),
      map((response: any) => {
        console.log(response);

        const user = response.user;
        console.log('isAuthenticated check:', !!user && !!user._id);
        return !!user && !!user._id;
      }),
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        return of(false);
      }),
    );
  }
}
