import { Task } from 'src/domain/enterprise/task.entity';

export class TaskPresenter {
  static toHTTP(task: Task) {
    return {
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      excerpt: task.excerpt,
      isFavorite: task.isFavorite,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
