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
  public clipboardText : string = "";
  private urlGame : string = "https://www.testUrl.es"

  private stageUp : string = "Other/stage_up";
  private stageDown : string = "Other/stage_down";
  private stageEqual : string = "Techniques/UI-Common_Techniques_Priority_VeryLow"

  ngOnInit()
  {

    let arrayTems : number[] = this.data.tems;
    let target = arrayTems[arrayTems.length -1]
    
    this.targetInfo = this.data.info[target! - 1];

    for (let i = 0; i < arrayTems.length; i++) {
      for (let j = 0; j < this.data.info.length; j++) {
        if (this.data.info[j].number === arrayTems[i]) {
          this.temInfo.push(this.data.info[j])
        }
        
      }
    }

    this.clipboardText += "Temdle completed in " + arrayTems.length + " attempts \n \n"
    
    let targetHeight = this.targetInfo!.details.height.cm
    let targetWeight = this.targetInfo!.details.weight.kg
    let targetTypes = this.targetInfo!.types
    
    for (let i = 0; i < this.temInfo.length; i++) {
      let height = this.temInfo[i].details.height.cm;
      let weight = this.temInfo[i].details.weight.kg;
      let types = this.temInfo[i].types;

      if (height < targetHeight) {
        this.summary[i] = []
        this.summary[i].push(this.stageUp)
        this.clipboardText += "🔼"
      }else if(height > targetHeight){
        this.summary[i] = []
        this.summary[i].push(this.stageDown)
        this.clipboardText += "🔽"
      }else{
        this.summary[i] = []
        this.summary[i].push(this.stageEqual)
        this.clipboardText += "🟩"
      }

      if (weight < targetWeight) {
        this.summary[i].push(this.stageUp)
        this.clipboardText += "🔼"
      }else if(weight > targetWeight){
        this.summary[i].push(this.stageDown)
        this.clipboardText += "🔽"
      }else{
        this.summary[i].push(this.stageEqual)
        this.clipboardText += "🟩"
      }

      let typesChecked = this.checkTypes(types, targetTypes)
      
      typesChecked.forEach(element =>{
        if (element) {
          this.summary[i].push("🟩");
          this.clipboardText += "🟩"
        }else{
          this.summary[i].push("🟥");
          this.clipboardText += "🟥"
        }
      })
      this.clipboardText += "\n"
    }

    this.clipboardText += "\n"
    this.clipboardText += "Do you want to try? " + this.urlGame;
    
  }

  checkTypes(types : string[], targetTypes : string[]) : boolean[]
  {
    let typeTested : boolean[] = [];
    types.forEach(element => {
      typeTested.push(targetTypes.includes(element))
    });

    return typeTested;
  }

  clipboard(event : MouseEvent)
  {
    
    const clicked : HTMLElement = <HTMLElement>event.target;
    navigator.clipboard.writeText(this.clipboardText);
    clicked.innerHTML = "Copied!"
    clicked.classList.add("text-lime-600");
  }

}
