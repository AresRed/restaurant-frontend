import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "../../../models/base/api-response.model";
import { Observable } from "rxjs";
import { ProductResponse } from "../../../models/product.model";
import { environment } from "../../../../../environments/environment";



@Injectable({
  providedIn: 'root',
})
export class InventoryMovementService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ApiResponse<ProductResponse[]>> { // TODO: Cambiar
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${environment.apiUrl}/api/v1/products`
    );
  }
}
