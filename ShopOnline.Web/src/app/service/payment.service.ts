import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'src/environment/environment';
import { Payment } from '../shoppingcart/payment/payment';
import { checkoutFormContent } from '../shoppingcart/payment/paymentContent';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }
  private API_URL = environment.API_URL;
  

  PostPayment(payment: Payment): Observable<checkoutFormContent> {
    return this.http.post<checkoutFormContent>(`${this.API_URL}/api/Payment/CreatePayment`, payment).pipe(
      catchError(this.handleError)
    );
  }

  handleError(handleError: HttpErrorResponse) {
    let errorMessage = ''
    if (handleError.error instanceof ErrorEvent) {
      errorMessage = 'bir hata oluştu ' + handleError.message
    }
    else {
      errorMessage = "sistemsel bir hata"
    }
    return throwError(errorMessage);
  }

}
