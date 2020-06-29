import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../services/login/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formGroup: FormGroup;

  constructor(private auth: AuthService) { }

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
          if(response.status === 200){
            alert("Successfull");
          }
      }, err => {
        if(err.status === 400){
          alert('Validation error');
        }else if(err.status === 404){
          alert("User not found");
        }else{
          alert("oops server error");
        }
      })
    }
  }
}
