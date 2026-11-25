import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private api = 'http://localhost:3000/api/reservations';

  constructor(private http: HttpClient) {}

  create(data: { equipment_id: number; start_date: string; end_date: string }) {
    return this.http.post<any>(this.api, data);
  }

  mine() {
    return this.http.get<any[]>(`${this.api}/mine`);
  }

  forEquipment(id: number) {
    return this.http.get<any[]>(`${this.api}/equipment/${id}`);
  }

  cancel(id: number) {
    return this.http.put<any>(`${this.api}/${id}/cancel`, {});
  }
  calendar(equipmentId: number, year: number, month: number) {
  return this.http.get<any[]>(
    `${this.api}/calendar/${equipmentId}?year=${year}&month=${month}`
  );
}
}