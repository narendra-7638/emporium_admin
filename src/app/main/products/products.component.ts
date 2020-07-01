import { Component, OnInit, ViewChild } from '@angular/core';
import { IProducts } from './../model/Products';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { ProductService} from './../services/products/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'price', 'created_on', 'is_active', 'actions'];
  dataSource = new MatTableDataSource<IProducts>([]);
  pageEvent:PageEvent;

  length = 100;
  pageSize = 20;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private prodService: ProductService) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchAgain(0, this.pageSize);
  }

  fetchAgain(skip: Number, limit: Number){
    this.prodService.getProducts(skip, limit)
    .subscribe( res=> {
      if(res.status === 200){
        this.dataSource = res.body.data.list;
        this.length = res.body.data.count;
      }
    })
  }

  action(event: PageEvent){
    let skip: Number = event.pageIndex * event.pageSize;
    let limit: Number = event.pageSize;
    this.fetchAgain(skip, limit);
  }

  delete(data:IProducts){
    console.log(data);
  }

  openCreate(){
    
  }
  
}
