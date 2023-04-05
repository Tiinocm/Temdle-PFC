import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TemtemApiService } from "src/app/services/temtem-api.service";
import { temtemsResponse } from '../models/temtems';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  public constructor(public service : TemtemApiService){}

  public selectTem : any;
  public search : any;

  public searchCtrl : FormControl<string | null> = new FormControl<string>('');

  public temtems : temtemsResponse[] = [];
  public allTemtems : any = null;
  public lastSearchValue : string = "";
  ngOnInit() : void
  {
    this.getTems();
    
    this.searchCtrl.valueChanges.pipe().subscribe(() =>{
      this.filterTems();
      
    })
  }

  private filterTems()
  {
    let searchValue = this.searchCtrl.value;
    if (searchValue!.length < this.lastSearchValue.length) {
      this.temtems = this.allTemtems;
    }
    this.lastSearchValue = searchValue!;
    this.temtems = this.temtems.filter(temtem => temtem.name.indexOf(searchValue!) > -1)
    
  }

  public getTems()
  {
    this.service.getAllTemtems().subscribe(response => {
      this.temtems = response;
      this.allTemtems = response;
      console.log(this.temtems);
      
    })
    
  }

  public onSubmit() : void
  {
    console.log(this.searchCtrl);
    console.log(this.selectTem);
  }
}
