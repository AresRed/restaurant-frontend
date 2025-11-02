import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { FileResponse } from '../../models/file/file.model';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly baseUrl = '/api/v1/files';

  constructor(private http: HttpClient) {}

  /**
   * 📤 Sube un archivo al servidor (AWS a través del backend)
   * @param file Archivo a subir
   * @param folder Carpeta destino (por defecto "general")
   */
  uploadFile(
    file: File,
    folder: string = 'general'
  ): Observable<ApiResponse<FileResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<ApiResponse<FileResponse>>(
      `${environment.apiUrl}${this.baseUrl}/upload`,
      formData
    );
  }

  /**
   * 📤 (Opcional) Subida con progreso — útil si quieres mostrar barra de carga
   */
  uploadFileWithProgress(
    file: File,
    folder: string = 'general'
  ): Observable<HttpEvent<ApiResponse<FileResponse>>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const req = new HttpRequest(
      'POST',
      `${environment.apiUrl}${this.baseUrl}/upload`,
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request<ApiResponse<FileResponse>>(req);
  }

  /**
   * 🗑️ Elimina un archivo por su ID
   * @param fileId ID del archivo
   */
  deleteFile(fileId: number): Observable<
    ApiResponse<{
      fileId: number;
      deletedById: number;
      deletedByUsername: string;
    }>
  > {
    return this.http.delete<
      ApiResponse<{
        fileId: number;
        deletedById: number;
        deletedByUsername: string;
      }>
    >(`${environment.apiUrl}${this.baseUrl}/delete/${fileId}`);
  }
}
