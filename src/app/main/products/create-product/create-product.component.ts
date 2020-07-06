import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from './../../services/products/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadService } from './../../services/upload.service';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CategoryService } from './../../services/categories/category.service';
import { ThemePalette } from '@angular/material/core';
import { CreateCategoryComponent } from '../../categories/create-category/create-category.component';
import { MessageComponent } from './../../../message/message.component';
import { Router } from '@angular/router';
import { IProductType } from './../../model/Products';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;

  public files = [];
  public image: String = "";
  public formGroup: FormGroup;
  public isSubmit: Boolean = false;
  public catList: Array<any> = [];

  public isLoading: Boolean = false;
  public color: ThemePalette = "primary";
  public sizeList: Array<Number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  public productType: Array<IProductType> = [
    { id: 0, name: "Normal" },
    { id: 1, name: "Mask" }
  ]

  constructor(
    public catService: CategoryService,
    public prodService: ProductService,
    public uploadService: UploadService,
    private dialogRef: MatDialogRef<CreateProductComponent>,
    private catDialog: MatDialog,
    private dialogMessage: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formGroup = this.prodService.form;
    this.fetchCat()
  }

  fetchCat() {
    this.isLoading = true;
    this.catService.getList(0, 1000)
      .subscribe(response => {
        this.isLoading = false;
        this.catList = response.body.data.list;
      }, error => {
        this.isLoading = false;
      })
  }

  save() {
    this.isLoading = true;
    this.isSubmit = true;
    if (this.formGroup.valid) {
      this.prodService.saveProduct(this.formGroup.value)
        .subscribe(response => {
          this.isLoading = false;
          // success
          // console.log(response);
          this.close();

        }, err => {
          this.isLoading = false;
          // error
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
  }

  upload() {
    const fileUpload = this.fileUpload.nativeElement;

    fileUpload.onchange = () => {
      // for (let index = 0; index < fileUpload.files.length; index++) {
      if (fileUpload.files[0]) {
        const file = fileUpload.files[0];
        // this.files.push(file);
        // }
        // this.uploadFiles();
        this.uploadFile(file);
      }

    };

    fileUpload.click();
  }

  // private uploadFiles() {
  //   this.fileUpload.nativeElement.value = '';
  //   this.files.forEach(file => {
  //     this.uploadFile(file);
  //   });
  // }

  uploadFile(file) {
    // console.log(file);
    this.isLoading = true;
    this.uploadService.upload('products', file)
      .subscribe(data => {
        this.isLoading = false;
        // add in formfield
        // console.log(data);
        this.image = data.Location
        this.formGroup.get('primary_pic').setValue(this.image);
      },
        err => {
          this.isLoading = false;
          this.openDialog("Error", "Unable to upload the Picture");
          // error caused while uploading
          // console.log(err);
          this.image = "";

        })
  }

  resetAll() {
    this.formGroup.reset()
    this.isSubmit = false;
    this.image = "";
    this.dialogRef.close();
  }

  close() {
    this.resetAll();
    this.dialogRef.close();
  }

  addCat() {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";

    const dialogRef = this.catDialog.open(CreateCategoryComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        this.fetchCat();
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
}
