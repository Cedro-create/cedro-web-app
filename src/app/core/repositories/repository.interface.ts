import { Observable } from 'rxjs';

export interface IRepository<T extends { id: string }> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T | undefined>;
  create(entity: Omit<T, 'id'>): Observable<T>;
  update(id: string, entity: Partial<T>): Observable<T>;
  delete(id: string): Observable<void>;
}
