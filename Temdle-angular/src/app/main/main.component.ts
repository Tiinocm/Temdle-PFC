import { Component, ViewChild , ViewContainerRef  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TemtemApiService } from "src/app/services/temtem-api.service";
import { temtemsResponse } from '../models/temtems';
import { TEMplateComponent } from '../template/template.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { WinModalComponent } from '../win-modal/win-modal.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})


export class MainComponent {

  public constructor(public service : TemtemApiService, public viewContainerRef: ViewContainerRef, public dialog : MatDialog){}

  @ViewChild('placeToRender', { read: ViewContainerRef })
  placeToRender!: ViewContainerRef;

  // search stuff
  public selectTem : any;
  public search : any;
  public defSelect = null;

  // form control search stuff
  public searchCtrl : FormControl<string | null> = new FormControl<string>('');

  //api response value
  public temtems : temtemsResponse[] = [];
  public allTemtems : any = null;
  public lastSearchValue : string = "";

  // game logic stuff
  public testedTypes : string[] = [];
  public targetId : number = this.getTargetId();
  public target : any = ""
  
  //win states
  public hasPlayerWon : boolean = false;
  public testedTems : number[] = [];

  ngOnInit() : void
  {
    this.defSelect = this.selectTem;

    this.getTems();
    this.getTarget()
    this.searchCtrl.valueChanges.pipe().subscribe(() =>{
      this.filterTems();
      
    })
  }

  getTargetId() : number
  {
    return 1;
  }

  private getTarget()
  {
    this.service.getTemtem(this.targetId).subscribe(response =>{
      this.target = response;
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
    if (this.selectTem.length > 0) {
      const temRef = this.placeToRender.createComponent(TEMplateComponent);
      temRef.instance.selectedTem = this.selectTem;
      temRef.instance.targetId = this.targetId;

      this.testedTems.push(Number(this.selectTem));

      if (this.selectTem == this.targetId) {
        console.log("has ganado!");
        this.hasPlayerWon = true;
        
        setTimeout(() => {
          let dialogRef = this.dialog.open(WinModalComponent, {
            width: '800px',
            data : {
              'tems' : this.testedTems,
              'info' : this.allTemtems
            }
          })
          
        }, 2000);
      }

      // manage session storage here
      this.service.getTemtem(this.selectTem).subscribe(response =>{
        this.getTemTypes(response);
        this.changeTypesStyle();
      })
      
    }

    this.selectTem = this.defSelect;
    let button : HTMLElement = document.getElementById("searchBtn")!;
    button.style.backgroundColor = "rgb(203 213 225)";
  }

  getTemTypes(temData : any)
  {
    let types = temData.types;
    for (let i = 0; i < types.length; i++) {
      this.testedTypes.indexOf(types[i]) === -1 ? this.testedTypes.push(types[i]) : "";
    }
    
  }

  changeTypesStyle()
  {
    for (let i = 0; i < this.testedTypes.length; i++) {
      let type = this.testedTypes[i];
      if (this.checkType(type)) {
        document.getElementById(type)!.classList.add("targetType", "scale-125", "transition-all")
        document.getElementById("qm-" + type)!.classList.add("opacity-0")

      }else{
        document.getElementById(type)?.classList.add("opacity-20", "grayscale", "transition-all");
        document.getElementById("qm-" + type)!.classList.add("opacity-0")
      }
      
    }
    
  }

  private checkType(type : string)
  {
    return this.target.types.indexOf(type) === -1 ? false : true;
  }

  public showBtn()
  {
    let button : HTMLElement = document.getElementById("searchBtn")!;
    button.style.backgroundColor = "#32a852";
  }

}
