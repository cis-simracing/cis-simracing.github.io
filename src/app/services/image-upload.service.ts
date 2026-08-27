import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface ImgBBResponse {
  data: {
    url: string;
    display_url: string;
    thumb: {
      url: string;
    };
  };
  success: boolean;
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private http = inject(HttpClient);
  private apiKey = environment.imgbbApiKey;
  private apiUrl = 'https://api.imgbb.com/1/upload';

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .post<ImgBBResponse>(`${this.apiUrl}?key=${this.apiKey}`, formData)
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data.display_url || response.data.url;
          }
          throw new Error('Upload fallito');
        }),
      );
  }
}
