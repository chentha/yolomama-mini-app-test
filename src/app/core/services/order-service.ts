import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // ── Object ──────────────────────────────
  private objectData = new BehaviorSubject<any>(null);
  objectData$ = this.objectData.asObservable();

  setObject(key: string, value: any): void {
    const current = this.objectData.getValue() ?? {};
    this.objectData.next({ ...current, [key]: value });
  }

  getObject(key: string): any {
    return this.objectData.getValue()?.[key] ?? null;
  }

  removeObject(key: string): void {
    const current = { ...this.objectData.getValue() };
    delete current[key];
    this.objectData.next(current);
  }

  // ── Array ────────────────────────────────
  private arrayData = new BehaviorSubject<any[]>([]);
  arrayData$ = this.arrayData.asObservable();

  setArray(data: any[]): void {
    this.arrayData.next(data);
  }

  getArray(): any[] {
    return this.arrayData.getValue();
  }

  pushToArray(item: any): void {
    const current = this.arrayData.getValue();
    this.arrayData.next([...current, item]);
  }

  removeFromArray(index: number): void {
    const current = this.arrayData.getValue();
    current.splice(index, 1);
    this.arrayData.next([...current]);
  }

  clearArray(): void {
    this.arrayData.next([]);
  }

  // ── Clear All ────────────────────────────
  clearAll(): void {
    this.objectData.next(null);
    this.arrayData.next([]);
  }
}
