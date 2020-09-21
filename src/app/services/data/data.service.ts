import { Injectable } from '@angular/core';
import { WebService } from '../web/web.service';
import { Observable } from 'rxjs';
import { Driver } from 'src/app/models/Driver.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private webService: WebService) { }



}
