import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService if you're using it

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {} // Inject CookieService

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    const token = this.cookieService.get('token'); // Get the token from cookies
    console.log(token);

    let clonedRequest = request.clone({
      withCredentials: true, // Include credentials (cookies)
    });

    // If token exists, add it to the Authorization header
    if (token) {
      clonedRequest = clonedRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}
