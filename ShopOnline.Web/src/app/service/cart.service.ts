import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Cart } from '../shoppingcart/cart';
import { ShoppingCart } from '../shoppingcart/shoppingcart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { }
  private API_URL = environment.API_URL;

  postCart(cart:Cart): Observable<Cart> {  
    return this.http.post<Cart>(this.API_URL + "/api/ShoppingCart", cart ).pipe(
      catchError(this.handleError));
  }

  GetCartByUser(userId:number):Observable<ShoppingCart[]>{
    return this.http.get<ShoppingCart[]>(`${this.API_URL}/api/ShoppingCart/${userId}/GetItems`).pipe(
      catchError(this.handleError));
  }

  CartRemove(ShoppingCartId:number):Observable<ShoppingCart>{
    return this.http.delete<ShoppingCart>(`${this.API_URL}/api/ShoppingCart/${ShoppingCartId}`).pipe(
      catchError(this.handleError));
  }

  CartPatch(ShoppingCartId:number, ShoppingCart:ShoppingCart):Observable<ShoppingCart>{
    return this.http.patch<ShoppingCart>(`${this.API_URL}/api/ShoppingCart/${ShoppingCartId}`,ShoppingCart).pipe(
      catchError(this.handleError));
  }


  handleError(handleError: HttpErrorResponse) {
    let errorMessage = ''
    if(handleError.error instanceof ErrorEvent){
      errorMessage = 'bir hata oluştu '+ handleError.message
    }
    else{
      errorMessage = "sistemsel bir hata"
    }
    return throwError(errorMessage);
  }

}
