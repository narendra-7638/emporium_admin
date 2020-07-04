import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ICategory } from '../../model/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    details: new FormControl('', []),
    icon: new FormControl('', [Validators.required]),
  })

  getList(skip: Number, limit: Number, filter: String = ""): Observable<any> {
    let params: HttpParams = new HttpParams();
    
    params = params.set('skip', skip.toString())
    params = params.set('limit', limit.toString())

    if(filter.length > 0){
      params = params.set('filter', filter.toString())
    }
    return this.http.get(`${baseUrl}category`, {
      headers: new HttpHeaders().set("authorization", localStorage.getItem('token')),
      observe: 'response',
      params: params
    })
  }

  save(data: ICategory): Observable<any>{
    return this.http.post(`${baseUrl}category`, data, {
      headers: new HttpHeaders().set("authorization", localStorage.getItem('token')),
      observe: 'response'
    })
  }
}
