import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
import {ICustomer} from './../../model/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient
  ) { }

  getList(skip: Number, limit: Number, filter: String = ""): Observable<any> {
    let params: HttpParams = new HttpParams();
    
    params = params.set('skip', skip.toString())
    params = params.set('limit', limit.toString())

    if(filter.length > 0){
      params = params.set('filter', filter.toString())
    }
    return this.http.get(`${baseUrl}admin/customers`, {
      headers: new HttpHeaders().set("authorization", localStorage.getItem('token')),
      observe: 'response',
      params: params
    })
  }

}
