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
  public summary : Array<string[]> = [[]];

  ngOnInit()
  {
    let arrayTems : number[] = this.data.tems;

    let target = arrayTems.pop()
    
    this.targetInfo = this.data.info[target! - 1];
    for (let i = 0; i < this.data.info.length; i++) {
      if (arrayTems.indexOf(this.data.info[i].number) !== -1) {
        this.temInfo.push(this.data.info[i])
      }
    }

    
    let targetHeight = this.targetInfo!.details.height.cm
    let targetWeight = this.targetInfo!.details.weight.kg
    let targetTypes = this.targetInfo!.types
    
    for (let i = 0; i < this.temInfo.length; i++) {
      let height = this.temInfo[i].details.height.cm;
      let weight = this.temInfo[i].details.weight.kg;
      let types = this.temInfo[i].types;

      if (height < targetHeight) {
        this.summary[i] = []
        this.summary[i].push("Other/stage_up")
      }else if(height > targetHeight){
        this.summary[i] = []
        this.summary[i].push("Other/stage_down")
      }else{
        this.summary[i] = []
        this.summary[i].push("Techniques/UI-Common_Techniques_Priority_VeryLow")
      }

      if (weight < targetWeight) {
        this.summary[i].push("Other/stage_up")
      }else if(weight > targetWeight){
        this.summary[i].push("Other/stage_down")
      }else{
        this.summary[i].push("Techniques/UI-Common_Techniques_Priority_VeryLow")
      }

      let typesChecked = this.checkTypes(types, targetTypes)
      // console.log(test, this.temInfo[i].name);
        typesChecked.forEach(element =>{
          if (element) {
            this.summary[i].push("🟩");
          }else{
            this.summary[i].push("🟥");
          }
        })
      

        /*    if (targetTypes.length === 1) {
        let typesChecked = this.checkTypesOne(types, targetTypes);
        if (typesChecked === 1) {
          this.summary[i].push("🟩");
          this.summary[i].push("🟩");
        }else if (typesChecked === 2) {
          this.summary[i].push("🟥");
          this.summary[i].push("🟥");
        }else if (typesChecked === 3){
          this.summary[i].push("🟩");
          this.summary[i].push("🟥");
        }
      }

      if (targetTypes.length === 2) {
        let typesCheckedTwo = this.checkTypesTwo(types, targetTypes)
      } */

    }
    console.log(this.summary);
    
  }

  checkTypes(types : string[], targetTypes : string[]) : boolean[]
  {
    let typeTested : boolean[] = [];
    types.forEach(element => {
      typeTested.push(targetTypes.includes(element))
    });

    return typeTested;
  }

/*   private checkTypesOne(types : string[], targetTypes : string[]) : number
  {
    if (types.length === 1) {
      if (types.includes(targetTypes[0])) {
        return 1;
      }else{
        return 2;
      }
    }else{
      if (types.includes(targetTypes[0])) {
        return 3;
      }else{
        return 2;
      }
    }
  }

  private checkTypesTwo(types : string[], targetTypes : string[]) : boolean
  {
    if (types.includes(targetTypes[0])) {
      return true;
    }else{
      return false;
    }
  } */

}
