// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { Task, TaskDto, getTasks, createTask, updateTask, deleteTask } from '../api/taskService';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<TaskDto>({
    title: '',
    description: '',
    isCompleted: false,
    status: 'Not Started'
  });
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const result = await createTask(newTask) as Task | { taskId: number };
      
      // If we get a taskId back instead of a full task
      if ('taskId' in result) {
        // Create a new task object manually
        const createdTask: Task = {
          id: result.taskId,
          title: newTask.title,
          description: newTask.description,
          isCompleted: newTask.isCompleted,
          status: newTask.status || 'Not Started',
          createdAt: new Date().toISOString()
        };
        setTasks([createdTask, ...tasks]);
      } else {
        // Otherwise use the result directly
        setTasks([result, ...tasks]);
      }
      
      setNewTask({
        title: '',
        description: '',
        isCompleted: false,
        status: 'Not Started'
      });
      setError(null);
      setSuccessMessage('Task created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
};

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { id, ...taskData } = editingTask;
      const updatedTask = await updateTask(id, taskData);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingTask(null);
      setError(null);
      setSuccessMessage('Task updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await deleteTask(deletingTaskId);
      setTasks(tasks.filter(task => task.id !== deletingTaskId));
      setDeletingTaskId(null);
      setError(null);
      setSuccessMessage('Task deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      const updatedTask = await updateTask(id, {
        ...taskToUpdate,
        isCompleted: !taskToUpdate.isCompleted
      });

      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
      console.error('Error toggling task completion:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Task Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded">
          {successMessage}
        </div>
      )}

      <div className="card p-6 space-y-6 bg-white dark:bg-gray-800">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="input w-full bg-gray-50 dark:bg-gray-700"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
                className="input w-full h-24 resize-none bg-gray-50 dark:bg-gray-700"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className="input w-full bg-gray-50 dark:bg-gray-700"
                disabled={isSubmitting}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            disabled={isSubmitting || !newTask.title.trim()}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Add Task
              </>
            )}
          </button>
        </form>

        <div className="flex gap-2">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f as typeof filter)}
              disabled={isSubmitting}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-3 hover:border-primary/50 transition-all duration-200"
              >
                {editingTask?.id === task.id ? (
                  <form onSubmit={handleUpdateTask} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="input w-full bg-gray-50 dark:bg-gray-700"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className="input w-full h-24 resize-none bg-gray-50 dark:bg-gray-700"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select
                        value={editingTask.status || 'Not Started'}
                        onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                        className="input w-full bg-gray-50 dark:bg-gray-700"
                        disabled={isSubmitting}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingTask(null)} 
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="h-5 w-5 mt-1 rounded border-gray-500 text-primary focus:ring-primary"
                        disabled={isSubmitting}
                      />
                      <div>
                        <h3 className={`font-medium ${task.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>Status: {task.status}</span>
                          <span>Created: {formatDate(task.createdAt)} at {formatTime(task.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-gray-400 hover:text-primary transition-colors"
                        title="Edit"
                        disabled={isSubmitting}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeletingTaskId(task.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                        disabled={isSubmitting}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 py-4">
              No tasks to display
            </p>
          )}
        </div>
      </div>

      {deletingTaskId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full animate-fadeIn">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delete Task</h3>
              <p className="text-gray-600 dark:text-gray-400">Are you sure you want to delete this task? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setDeletingTaskId(null)} 
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteTask} 
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}