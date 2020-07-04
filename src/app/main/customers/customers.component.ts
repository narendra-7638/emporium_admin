import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from './../services/customers/customer.service';
import { ICustomer } from './../model/Customer';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageComponent } from './../../message/message.component';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'email', 'created_on', 'phone', 'is_blocked'];
  public dataSource = new MatTableDataSource<ICustomer>([]);
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
    private customerService: CustomerService,
    private router: Router,
    private dialogMessage: MatDialog,
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.search = "";
    this.dataSource.paginator = this.paginator;
    this.fetchAgain(0, this.pageSize, this.search);
  }

  fetchAgain(skip: Number, limit: Number, filter: String) {
    this.isLoading = true;
    this.customerService.getList(skip, limit, filter)
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
        } else if (err.status === 400) {
          this.openDialog("Error", err.error.message);
          // alert('Validation error');
        } else if (err.status === 404) {
          this.openDialog("Error", err.error.message);
          // alert("User not found");
        } else {
          this.openDialog("Error", err.error.message);
          // alert("oops server error");
        }
      })
  }

  openDialog(status: String, message: String) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "50%";
    dialogConfig.data = {
      status: status,
      message: message
    }
    this.dialogMessage.open(MessageComponent, dialogConfig);
  }


  action(event: PageEvent) {
    this.skip = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.fetchAgain(this.skip, this.limit, this.search);
  }
}
