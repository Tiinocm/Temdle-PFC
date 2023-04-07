import { Component, ViewChild , ViewContainerRef  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TemtemApiService } from "src/app/services/temtem-api.service";
import { temtemsResponse } from '../models/temtems';
import { TEMplateComponent } from '../template/template.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})


export class MainComponent {

  public constructor(public service : TemtemApiService, public viewContainerRef: ViewContainerRef){}

  @ViewChild('placeToRender', { read: ViewContainerRef })
  placeToRender!: ViewContainerRef;


  public selectTem : any;
  public search : any;
  public defSelect = null;

  public searchCtrl : FormControl<string | null> = new FormControl<string>('');

  public temtems : temtemsResponse[] = [];
  public allTemtems : any = null;
  public lastSearchValue : string = "";
  ngOnInit() : void
  {
    this.defSelect = this.selectTem;

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
    this.temtems = this.temtems.filter(temtem => temtem.name.toLowerCase().indexOf(searchValue!.toLowerCase()) > -1)
    
  }

  public getTems()
  {
    this.service.getAllTemtems().subscribe(response => {
      this.temtems = response;
      this.allTemtems = response;
      
    })
    
  }

  public onSubmit() : void
  {
    const temtemDiv = document.getElementById("temtemDiv");
    const temRef = this.placeToRender.createComponent(TEMplateComponent);
    temRef.instance.selectedTem = this.selectTem;
    this.selectTem = this.defSelect;
    let button : HTMLElement = document.getElementById("searchBtn")!;
    button.style.backgroundColor = "rgb(203 213 225)";
  }

  public showBtn()
  {
    //mostrar el botón de "go" (submit) cuando se selecciona una opción
    let button : HTMLElement = document.getElementById("searchBtn")!;
    button.style.backgroundColor = "#32a852";
  }

}
