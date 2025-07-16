import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Locations } from '../models/Locations';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Locations[]> {
    return this.http.get<Locations[]>('http://localhost:5000/api/WarehouseLocation/GetAllLocations');
  }
}
