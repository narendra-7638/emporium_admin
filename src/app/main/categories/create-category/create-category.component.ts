import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService } from './../../services/categories/category.service';
import { FormGroup } from '@angular/forms';
import { UploadService } from './../../services/upload.service';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import {ThemePalette} from '@angular/material/core';
// import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {MessageComponent} from './../../../message/message.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  public formGroup: FormGroup;
  public image: String = "";
  public isSubmit: Boolean = false;
  public isLoading: Boolean = false;
  public color: ThemePalette = "primary";

  constructor(
    private catService: CategoryService,
    private uploadService: UploadService,
    private dialogRef: MatDialogRef<CreateCategoryComponent>,
    private dialogMessage: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.formGroup = this.catService.form;
  }

  save(){
    this.isLoading = true;
    this.isSubmit = true;
    if (this.formGroup.valid) {
      this.catService.save(this.formGroup.value)
      .subscribe(response => {
        // success
        // console.log(response);
        this.openDialog("Success", response.body.message);
        this.resetAll();
      }, err => {
        // error
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

  upload(){
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

  uploadFile(file){
    // console.log(file);
    this.isLoading = true;
    this.uploadService.upload('products', file)
      .subscribe(data => {
        // add in formfield
        // console.log(data);
        this.isLoading = false;
        this.image = data.Location
        this.formGroup.get('icon').setValue(this.image);
      },
        err => {
          this.isLoading = false;
          this.openDialog("Error", "Unable to upload the Picture");
          // error caused while uploading
          // console.log(err);
          this.image = "";

        })
  }

  resetAll(){
    this.formGroup.reset()
    this.isSubmit = false;
    this.image = "";
    this.dialogRef.close();
    this.isLoading = false;
  }

  close(){
    this.resetAll();
    this.dialogRef.close();
  }
}
