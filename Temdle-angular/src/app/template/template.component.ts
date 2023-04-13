import { Component } from '@angular/core';

import { TemtemApiService } from "src/app/services/temtem-api.service";
import { temtemsResponse } from '../models/temtems';
import { Temtem } from "../interfaces/temtem";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TEMplateComponent {


  public selectedTem : string = "";
  public infoTem : any = Temtem;
  public targetId : number = 0;
  public targetInfo : any = Temtem;

  public sticker : string = "";
  public types : string[] = [""];

  public heightImg : string = "";
  public weightImg : string = "";

  constructor(public service : TemtemApiService) {}

  ngOnInit()
  {
    this.getTemInfo();
  }

  private getTemInfo()
  {
    this.service.getTemtem(this.selectedTem).subscribe(response => {
      this.infoTem = response;
      if(this.infoTem.name.indexOf(" ") > 0){
        let splitted = this.infoTem.name.split(" ")
        this.infoTem.name = splitted[0]
      }
      //get sticker name stored in /assets..
      if (response.number < 10) {
        this.sticker = "M00" + response.number + ".png";
      }else if (response.number < 100) {
        this.sticker = "M0" + response.number + ".png";
      }else {
        this.sticker = "M" + response.number + ".png";
      }


      //get types name stored in /assets
      this.types = response.types;
      this.getTargetInfo();
    })

  }

  private getTargetInfo()
  {
    this.service.getTemtem(this.targetId).subscribe(response => {
      this.targetInfo = response;

      this.compareStats();
    })
  }
  
  compareStats()
  {
    const temHeight : number = this.infoTem.details.height.cm
    const targetHeight : number = this.targetInfo.details.height.cm

    const temWeight : number = this.infoTem.details.weight.kg
    const targetWeight : number = this.targetInfo.details.weight.kg

    if (temHeight < targetHeight) {
      this.heightImg = "Other/stage_up"
    }else if (temHeight > targetHeight){
      this.heightImg = "Other/stage_down"
    }else{
      this.heightImg = "Techniques/UI-Common_Techniques_Priority_VeryLow"
    }
    console.log("height: " + temHeight + ", " + targetHeight + ", ");
    console.log("weight: " + temWeight + ", " + targetWeight + ", ");
    
    if (temWeight < targetWeight) {
      this.weightImg = "Other/stage_up"
    }else if (temWeight > targetWeight){
      this.weightImg = "Other/stage_down"
    }else{
      this.weightImg = "Techniques/UI-Common_Techniques_Priority_VeryLow"
    }
  }
}
