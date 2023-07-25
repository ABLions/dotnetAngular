import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ITask } from '../interfaces/todo-interface';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {

  }

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiUrl}`);
  }

  getTasksById(id: number): Observable<ITask> {
    return this.http.get<ITask>(`${this.apiUrl}/${id}`);
  }

  saveTask(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(`${this.apiUrl}`, task);
  }

  updateTask(id: number, task: ITask): Observable<ITask> {
    return this.http.put<ITask>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTaskStatus(taskId: number, task: ITask, newStatus: string): Observable<void> {
    task.status = newStatus;
    return this.updateTask(taskId, task).pipe(
      map(() => { }),
      catchError((error: any) => {
        console.error('Error updating task status:', error);
        return throwError('Failed to update task status');
      })
    );
  }
}
