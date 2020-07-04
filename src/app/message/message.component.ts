import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  public status: String;
  public message: String;

  constructor(
    private dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.status = data.status;
    this.message = data.message;
  }

  ngOnInit(): void {    
    setTimeout(() => {
      this.dialogRef.close()
    }, 800);
  }

}
