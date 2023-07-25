import { Pipe, PipeTransform } from '@angular/core';
import { ITask } from '../interfaces/todo-interface';


@Pipe({
  name: 'filterByStatus'
})
export class FilterByStatusPipe implements PipeTransform {

  transform(tasks: ITask[] | undefined, status: string): ITask[] | undefined {
    return tasks?.filter(task => task.status === status);
  }

}
