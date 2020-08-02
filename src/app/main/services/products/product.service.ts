import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IProducts } from './../../model/Products';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    size: new FormControl([], []),
    details: new FormControl('', [Validators.required]),
    features: new FormControl('', []),
    primary_pic: new FormControl([]),
    secondary_pics: new FormControl([], []),
    is_active: new FormControl(false, []),
    is_trending: new FormControl(false, []),
    is_featured: new FormControl(false, []),
    category: new FormControl('', [Validators.required]),
    type: new FormControl(0),
    total_quantity: new FormControl(0),
  });

  getProducts(
    skip: Number,
    limit: Number,
    filter: String = ''
  ): Observable<any> {
    let params: HttpParams = new HttpParams();

    params = params.set('skip', skip.toString());
    params = params.set('limit', limit.toString());

    if (filter.length > 0) {
      params = params.set('filter', filter.toString());
    }

    return this.http.get(`${baseUrl}products`, {
      headers: new HttpHeaders().set(
        'authorization',
        localStorage.getItem('token')
      ),
      observe: 'response',
      params,
    });
  }

  saveProduct(data: IProducts): Observable<any> {
    return this.http.post(`${baseUrl}products`, data, {
      headers: new HttpHeaders().set(
        'authorization',
        localStorage.getItem('token')
      ),
      observe: 'response',
    });
  }
}
