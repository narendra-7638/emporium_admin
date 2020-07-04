import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../services/login/auth.service';
import { MessageComponent } from './../message/message.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void{
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  loginProcess(): void {
    if(this.formGroup.valid){
      this.auth.login(this.formGroup.value)
      .subscribe(response => {
          this.openDialog("Success", response.body.message);
          if(response.status === 200){
            this.router.navigate(['']);
            localStorage.setItem('token', response.body.data.token);
          }
      }, err => {
        
        if(err.status === 400){
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
    this.dialog.open(MessageComponent, dialogConfig);
  }
}
