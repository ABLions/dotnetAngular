import { Component } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ITask } from '../interfaces/todo-interface';

@Component({
  selector: 'app-todo-main',
  templateUrl: './todo-main.component.html',
  styleUrls: ['./todo-main.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class TodoMainComponent {
  taskDialog: boolean = false;
  tasks: ITask[] = [];
  task!: ITask;
  availableTasks: ITask[] | undefined;
  selectedTask: ITask[] | undefined;
  draggedTask: ITask | undefined | null;
  completedTasks: ITask[] | undefined;

  submitted: boolean = false;


  constructor(
    private todoService: TodoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.task = {} as ITask;
  }

  ngOnInit() {
    this.availableTasks = [];
    this.getTasks();
  }

  getTasks() {
    this.todoService.getTasks().subscribe(data => {
      this.availableTasks = data;
    })
  }

  dragStart(task: ITask) {
    this.draggedTask = task;
  }


  drop(event: any, newStatus: string) {
    if (this.draggedTask && this.draggedTask.id !== undefined) {
      const updatedTask: ITask = {
        id: this.draggedTask.id,
        status: newStatus,
        title: this.draggedTask.title,
        description: this.draggedTask.description
      };

      this.todoService.updateTaskStatus(this.draggedTask.id, updatedTask, newStatus).subscribe(() => {
        if (this.availableTasks) {
          const draggedTaskIndex = this.draggedTask?.id ? this.findIndex(this.draggedTask) : -1;
          if (draggedTaskIndex !== -1) {
            this.availableTasks.splice(draggedTaskIndex, 1);
          }
        }
        if (newStatus === 'ToDo') {
          this.availableTasks = [...(this.availableTasks || []), updatedTask];
        } else if (newStatus === 'InProgress') {
          this.selectedTask = [...(this.selectedTask || []), updatedTask];
        } else if (newStatus === 'Done') {
          this.completedTasks = [...(this.completedTasks || []), updatedTask];
        }
        this.draggedTask = null;
        this.getTasks();
      });
    }
  }





  dragEnd() {
    this.draggedTask = null;
  }

  findIndex(task: ITask) {
    if (this.availableTasks && this.availableTasks.length > 0) {
      return this.availableTasks.findIndex(t => t.id === task.id);
    }
    return -1;
  }


  openNew(task: ITask | undefined = undefined) {
    this.submitted = false;
    this.task = { ...task } as ITask; // Copy the task if provided, or create a new task
    this.taskDialog = true;
  }

  hideDialog() {
    this.submitted = false;
    this.taskDialog = false;
  }

  saveTask() {
    this.submitted = true;

    if (this.task && this.task.title?.trim()) {
      if (this.task.id) {
        console.log("entra a update", this.task.id);
        const taskId = this.task.id.toString();
        const index = this.findIndexById(taskId);
        // if (index !== -1) {
        this.todoService.updateTask(this.task.id, this.task).subscribe(() => {
          this.tasks[index] = this.task;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Updated', life: 3000 });
          this.getTasks();
        });
        // }
      } else {
        this.task.status = 'ToDo'; // Set initial status as 'ToDo'
        this.todoService.saveTask(this.task).subscribe((savedTask) => {
          if (this.availableTasks) {
            this.availableTasks.push(savedTask);
          }
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Created', life: 3000 });
          this.getTasks(); // Fetch the updated list of tasks
        });
      }
    }
    this.taskDialog = false;
    this.task = {} as ITask;
  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === parseInt(id)) {
        index = i;
        break;
      }
    }

    return index;
  }

  deleteTask(id: number, task: ITask) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + task.title + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tasks = this.tasks.filter((val) => val.id !== id);
        this.task = {};
        this.todoService.deleteTask(id).subscribe(result => {
          console.log(result);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Deleted', life: 3000 });
          this.getTasks(); // Fetch the updated list of tasks
        })
      }
    })
  }
}
