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
import {Observable} from 'rxjs';

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

  public imagesList: Array<String|ArrayBuffer>;
  public imagesLink: Array<String>;
  public imagesCount: number;
  
  public imageLinks: Array<String>;

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
    this.fetchCat();
    this.imagesLink = [];
    this.imagesList = [];
    this.imagesCount = 0;
    this.imageLinks = [];
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
    // this.isLoading = true;
    // this.isSubmit = true;
    // if (this.formGroup.valid) {
      this.prodService.saveProduct(this.formGroup.value)
        .subscribe(response => {
          this.isLoading = false;
          // success
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
    // }
  }

  upload() {
    const fileUpload = this.fileUpload.nativeElement;

    fileUpload.onchange = () => {
      if (fileUpload.files.length > 0) {
        this.imagesCount = fileUpload.files.length;
        Array.prototype.forEach.call(fileUpload.files, (file) => {

          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = (event) => {
            this.imagesList.push(event.target.result);
          }

        })
        // this.uploadFile(file);
      }
    };

    fileUpload.click();
  }

  uploadFiles() {
    // console.log(file);
    this.isLoading = true;
    this.isSubmit = true;
    if(this.formGroup.invalid){
      return;
    }
    Array.prototype.forEach.call(this.fileUpload.nativeElement.files, (file) => {
      this.uploadService.upload('products', file)
      .subscribe(data => {
        // this.isLoading = false;
        // add in formfield
        // console.log(data);
        // this.image = data.Location
        this.imageLinks.push(data.Location)
        this.imagesCount -= 1;
        if(this.imagesCount === 0){
          this.formGroup.get('primary_pic').setValue(this.imageLinks);
          this.save();
        }
      },
        err => {
          this.isLoading = false;
          this.openDialog("Error", "Unable to upload the Picture");
          // error caused while uploading
          // console.log(err);
          this.image = "";
        })
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
