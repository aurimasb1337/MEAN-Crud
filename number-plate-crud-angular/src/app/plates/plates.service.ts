import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatesService {
  backendBaseURL = 'http://localhost:3000/api/plates';

  constructor(private httpClient: HttpClient) { }

  get(start = 1) {
    return this.httpClient.get(this.backendBaseURL, {
      params: new HttpParams().set('start', start.toString())
    });
  }


  search(searchText) {
    return this.httpClient.get(`${this.backendBaseURL}/search`, {
      params: new HttpParams().set('search', searchText)
    });
  }


  getCount() {
    return this.httpClient.get(`${this.backendBaseURL}/count`);
  }


  create(data): Observable<any> {
    return this.httpClient.post(
      `${this.backendBaseURL}`,
      JSON.stringify(data),
      {
        headers: new HttpHeaders({
          'content-type': 'application/json',
        }),
      }
    );
  }

  delete(id): Observable<any> {
    return this.httpClient.delete(
      `${this.backendBaseURL}`,
      {
        params: new HttpParams().set('id', id)
      }
    );
  }

  update(plate): Observable<any> {
    return this.httpClient.put(
      `${this.backendBaseURL}`,

      JSON.stringify(plate),

      {
        headers: new HttpHeaders({
          'content-type': 'application/json'
        })
      }
    );
  }
}
