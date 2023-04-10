import { Component } from '@angular/core';
import { TemtemApiService } from "src/app/services/temtem-api.service";

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent {

  constructor(public service : TemtemApiService) {}

  ngOnInit()
  {
    this.getTypes()
  }

  public getTypes() 
  {
    this.service.getTypes().subscribe(response =>{
      console.log(response);
      
    });
  }
}
