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

  public sticker : string = "";
  public types : string[] = [""];

  constructor(public service : TemtemApiService) {}

  ngOnInit()
  {
    this.getTemInfo();
  }

  private getTemInfo()
  {
    this.service.getTemtem(this.selectedTem).subscribe(response => {
      this.infoTem = response;

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
      
    })

  }
  
}
