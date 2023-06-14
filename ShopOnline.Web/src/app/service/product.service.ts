import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import { Product } from '../product/product';
import { Observable, throwError } from 'rxjs';
import { tap,catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http:HttpClient) { }
  private API_URL= environment.API_URL;

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(this.API_URL + "/api/Product").pipe(catchError(this.handleError));       
  }

  GetByProduct(productId:number){
    return this.http.get<Product>(`${this.API_URL}/api/Product/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

 

  GetItemsByCategory(categoryId:number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/api/Product/${categoryId}/GetItemsByCategory`).pipe(
      catchError(this.handleError)
    );
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
