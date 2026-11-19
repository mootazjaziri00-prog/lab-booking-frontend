import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface EquipmentQuery {
  search: string;
  category: string[];
  brand: string[];
  location: string[];
  available: string;
  sort: string;
  order: string;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private api = 'http://localhost:3000/api/equipment';

  constructor(private http: HttpClient) {}

  list(q: EquipmentQuery) {
    let params = new HttpParams()
      .set('search', q.search)
      .set('sort', q.sort)
      .set('order', q.order)
      .set('page', q.page)
      .set('limit', q.limit);

    if (q.category.length) params = params.set('category', q.category.join(','));
    if (q.brand.length) params = params.set('brand', q.brand.join(','));
    if (q.location.length) params = params.set('location', q.location.join(','));
    if (q.available !== '') params = params.set('available', q.available);

    return this.http.get<any>(this.api, { params });
  }

  filters() {
    return this.http.get<any>(`${this.api}/filters`);
  }
}