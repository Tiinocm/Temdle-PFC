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
  public printInfo : any[] = []
  public targetInfo : any;
  public summary : string = "";

  ngOnInit()
  {
    let arrayTems : number[] = this.data.tems;

    let target = arrayTems.pop()

    this.targetInfo = this.data.info[target!];
    for (let i = 0; i < this.data.info.length; i++) {
      if (arrayTems.indexOf(this.data.info[i].number) !== -1) {
        this.temInfo.push(this.data.info[i])
      }
    }

    
/*     let targetHeight = this.targetInfo!.details.height.cm
    let targetWeight = this.targetInfo!.details.weight.kg

    for (let i = 0; i < this.temInfo.length; i++) {
      let height = this.temInfo[i].details.height.cm;

      if (height < targetHeight) {
        this.summary += "&#128316;"
      }else if(height > targetHeight){
        this.summary += "&#128317;"
      }else{
        this.summary += "&#128316;"
      }
    } */
    
    
  }
}
