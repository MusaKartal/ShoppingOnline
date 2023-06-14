import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { tap,catchError } from 'rxjs/operators';
import { category } from '../category/category';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }

  private API_URL= environment.API_URL;
  
  getCatagories():Observable<category[]>{
    return this.http.get<category[]>(this.API_URL + "/api/Product/GetProductCategories").pipe(catchError(this.handleError))    
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
