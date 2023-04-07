import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TEMplateComponent } from './template.component';

describe('TEMplateComponent', () => {
  let component: TEMplateComponent;
  let fixture: ComponentFixture<TEMplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TEMplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TEMplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
