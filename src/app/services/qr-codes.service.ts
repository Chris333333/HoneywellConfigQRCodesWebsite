import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QRCodesList } from '../models/QRCodesList';

@Injectable({
  providedIn: 'root'
})
export class QrCodesService {

  constructor(private http: HttpClient) { }

  getQRCodesList(localID: number): Observable<QRCodesList[]> {
      return this.http.get<QRCodesList[]>(`http://localhost:5000/api/HoneyWellQRImage/GetAllImages?LocalID=${localID}`);
    }
}
