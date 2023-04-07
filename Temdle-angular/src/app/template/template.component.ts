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

  constructor(public service : TemtemApiService) {}

  ngOnInit()
  {
    this.getTemInfo();
  }

  private getTemInfo()
  {
    let info;
    this.service.getTemtem(this.selectedTem).subscribe(response => {
      this.infoTem = response;
    })


  }
}
