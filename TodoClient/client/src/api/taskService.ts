// src/api/taskService.ts
const API_BASE_URL = "https://localhost:7169/api/Task";

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  status?: string;
}

export interface TaskDto {
  title: string;
  description: string;
  isCompleted: boolean;
  status?: string;
}

// src/api/taskService.ts
export const getTasks = async (): Promise<Task[]> => {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch tasks');
    }
  
    return await response.json();
  };

export const getTaskById = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch task: ${errorText}`);
  }

  return await response.json();
};

export const getTaskStatus = async (id: number): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/status/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch task status: ${errorText}`);
  }

  const statusData = await response.json();
  return statusData.status;
};

export const createTask = async (taskData: TaskDto): Promise<Task> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          Title: taskData.title,
          Description: taskData.description,
          IsCompleted: taskData.isCompleted,
          Status: taskData.status
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }
  
      const responseData = await response.json();
      
      // If we get a taskId back from the API but not a full task object
      if (responseData.taskId && !responseData.title) {
        return {
          id: responseData.taskId,
          title: taskData.title,
          description: taskData.description,
          isCompleted: taskData.isCompleted,
          createdAt: new Date().toISOString(),
          status: taskData.status
        };
      }
      
      return responseData;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
};

export const updateTask = async (id: number, taskData: TaskDto): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        Title: taskData.title,
        Description: taskData.description,
        IsCompleted: taskData.isCompleted,
        Status: taskData.status
      }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update task: ${errorText}`);
    }
  
    // Check if response is JSON or plain text
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      
      // If the API doesn't return a complete task object
      if (typeof responseData === 'string' || !responseData.title) {
        return {
          id,
          title: taskData.title,
          description: taskData.description,
          isCompleted: taskData.isCompleted,
          createdAt: new Date().toISOString(),
          status: taskData.status
        };
      }
      
      return responseData;
    } else {
      return {
        id,
        title: taskData.title,
        description: taskData.description,
        isCompleted: taskData.isCompleted,
        createdAt: new Date().toISOString(),
        status: taskData.status
      };
    }
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete task: ${errorText}`);
  }
};