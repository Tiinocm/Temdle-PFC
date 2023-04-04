import { Component } from '@angular/core';

import { TemtemApiService } from "src/app/services/temtem-api.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  public constructor(public service : TemtemApiService){}

  ngOnInit() : void
  {
    this.getTems();
  }

  public getTems()
  {
    this.service.getAllTemtems().subscribe(response => {
      console.log(response);
    })
    
  }
}
