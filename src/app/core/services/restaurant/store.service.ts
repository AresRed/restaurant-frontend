import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) {
    
  }

  getAllStores() { }
  
  getStoreById() { }
  
  addStore() { }

  updateStoreById() {}
  
  deleteStoreById() {}

}