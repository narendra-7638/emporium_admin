import { Component, OnInit, ViewChild } from '@angular/core';
import { ICategory } from './../model/Category';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from './../services/categories/category.service';
import { CreateCategoryComponent } from './create-category/create-category.component';
import {ThemePalette} from '@angular/material/core';
import { Router } from '@angular/router';
import { MessageComponent} from './../../message/message.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'details', 'created_on', 'icon'];
  public dataSource = new MatTableDataSource<ICategory>([]);
  public pageEvent: PageEvent;

  public length = 100;
  public pageSize = 20;
  public pageSizeOptions: number[] = [5, 10, 25, 100];

  public skip: Number = 0;
  public limit: Number = this.pageSize;
  public search: String;

  public isLoading: Boolean = false;
  public color: ThemePalette = "primary";

  constructor(
    private catService: CategoryService,
    private dialog: MatDialog,
    private dialogMessage: MatDialog,
    private router: Router
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.search = "";
    this.dataSource.paginator = this.paginator;
    this.fetchAgain(0, this.pageSize, this.search);
  }

  fetchAgain(skip: Number, limit: Number, filter: String) {
    this.isLoading = true;
    this.catService.getList(skip, limit, filter)
      .subscribe(res => {
        this.isLoading = false;
        if (res.status === 200) {
          this.dataSource = res.body.data.list;
          this.length = res.body.data.count;
        }
      }, err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.openDialog("Error", err.error.message);
          localStorage.removeItem('token');
          this.router.navigate(['login']);
        } else if(err.status === 400){
          this.openDialog("Error", err.error.message);
          // alert('Validation error');
        }else if(err.status === 404){
          this.openDialog("Error", err.error.message);
          // alert("User not found");
        }else{
          this.openDialog("Error", err.error.message);
          // alert("oops server error");
        }
      })
  }

  filterAction() {
    this.fetchAgain(this.skip, this.limit, this.search);
  }

  action(event: PageEvent) {
    this.skip = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.fetchAgain(this.skip, this.limit, this.search);
  }

  openCreate() {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(CreateCategoryComponent, dialogConfig);

    dialogRef.afterClosed()
    .subscribe(result => {
      this.filterAction();
    })
  }

  openDialog(status: String, message: String){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "50%";
    dialogConfig.data = {
      status: status,
      message: message
    }
    this.dialogMessage.open(MessageComponent, dialogConfig);
  }
}
