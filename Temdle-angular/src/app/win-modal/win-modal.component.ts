import { Component } from '@angular/core';

import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-win-modal',
  templateUrl: './win-modal.component.html',
  styleUrls: ['./win-modal.component.css']
})
export class WinModalComponent {


  constructor (@Inject(MAT_DIALOG_DATA) public data : any) {}

  public temInfo : any[] = []

  ngOnInit()
  {
    let arrayTems : number[] = this.data.tems;

    let target = arrayTems.pop()
    for (let i = 0; i < this.data.info.length; i++) {
      if (arrayTems.indexOf(this.data.info[i].number) !== -1) {
        this.temInfo.push(this.data.info[i])
      }
    }
    
    
    
    
  }
}
