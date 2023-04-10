import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { temtemsResponse } from '../models/temtems';
import { TypesResponse } from '../models/types';
@Injectable({
  providedIn: 'root'
})
export class TemtemApiService {

  constructor(public http : HttpClient) { }
  private commonUrl : string = "https://temtem-api.mael.tech/api/";

  public getAllTemtems() : Observable<temtemsResponse[]> {

    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers',
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return this.http.get<temtemsResponse[]>(this.commonUrl + "temtems")
  }

  public getTemtem(number : string) : Observable<temtemsResponse> {
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers',
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return this.http.get<temtemsResponse>(this.commonUrl + "temtems/" + number)
  }

  public getTypes() : Observable<TypesResponse[]>{
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers',
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return this.http.get<TypesResponse[]>(this.commonUrl + "types")
  }
}
