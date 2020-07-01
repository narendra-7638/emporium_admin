import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(skip: Number, limit: Number): Observable<any>{
    return this.http.get(`${baseUrl}products`,{
      observe: 'response',
      params: new HttpParams().set("skip", skip.toString()).set('limit', limit.toString())
    })
  }
}
