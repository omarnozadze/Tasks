// JavaScript
window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");
  const counter = document.querySelector("#counter");
  const activeList = document.querySelector("#active");
  const completedList = document.querySelector("#completed")
  const todoEndpoint = "http://127.0.0.1:8000/tasks/";

  let taskCount = 0; // Initialize task count

  // Add New Task
  async function addNewTask(task) {
    try {
      const response = await fetch(todoEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      const tasks = await response.json();


      

      // Create a new task element and append it to the list
      const task_el = createTaskElement(task);
      list_el.querySelector("ul").appendChild(task_el);
      taskCount += 1; // Increase task count by 1
      counter.textContent = taskCount; // Update the counter

      return tasks;
    } catch (error) {
      throw new Error(error)
    }
  }

  // Creating Task Element
  function createTaskElement(task) {
    const task_el = document.createElement("li");
    task_el.classList.add("task");

    const task_content_el = document.createElement("input");
    task_content_el.type = "text";
    task_content_el.disabled = true;
    task_content_el.value = task.title;

    // Updating Task Status
    async function updateTaskCompletionStatus(taskId, completed) {
      try {
        const response = await fetch(`${todoEndpoint}${taskId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
          throw new Error("Failed to update the task completion status");
        }

        const tasks = await response.json();
        return tasks;
      } catch (error) {
        console.error("Error updating the task completion status:", error);
        return null;
      }
    }

    const checkbox_el = document.createElement("input");
    checkbox_el.type = "checkbox";
    checkbox_el.checked = task.completed;
    checkbox_el.addEventListener('change', () => {
      updateTaskCompletionStatus(task.id, checkbox_el.checked);
    });

    const checkbox_item_el = document.createElement("div");
    checkbox_item_el.classList.add("checkbox-item");
    checkbox_item_el.appendChild(checkbox_el);

    task_el.appendChild(checkbox_item_el);
    task_el.appendChild(task_content_el);

    // Edit Button
    function editButton() {
      const task_edit_el = document.createElement("button");
      task_edit_el.classList.add("edit");
      task_edit_el.textContent = "Edit";
      task_el.appendChild(task_edit_el);
      task_edit_el.addEventListener('click', () => {
        if (task_edit_el.textContent === "Edit") {
          task_edit_el.textContent = "Save";
          task_content_el.disabled = false;
          task_content_el.focus();
        } else {
          task_edit_el.textContent = "Edit";
          task_content_el.disabled = true;
          updateTaskTitle(task.id, task_content_el.value);
        }
      });
    }

    editButton(); // Call the editButton function

    // Delete Button

    const task_delete_el = document.createElement("button");
    task_delete_el.classList.add("delete");
    task_delete_el.textContent = "Delete";
    task_el.appendChild(task_delete_el);
    task_delete_el.addEventListener('click',  () => {
       deleteTask(task.id);
      task_el.remove();
      taskCount -= 1; // Decrease task count by 1
      counter.textContent = taskCount; // Update the counter
    });

    return task_el;
  }

  // async DELETE TASK by ID
  async function deleteTask(taskId) {
    try {
      const response = await fetch(`${todoEndpoint}${taskId}/`, 
      { method: "DELETE" });
      return true
    } catch (error) {
      throw new Error(error)
    }
  }


  // Updating Task Title
  async function updateTaskTitle(taskId, newTitle) {
    try {
      const response = await fetch(`${todoEndpoint}${taskId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }), // Include the new title in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to update the task title");
      }

      const task = await response.json();
      return task;
    } catch (error) {
      console.error("Error updating the task title:", error);
      return null;
    }
  }

  // Fetch existing tasks from the server
  fetch(todoEndpoint)
    .then((response) => response.json())
    .then((data) => {
      // Clear the existing task list on the frontend
      list_el.querySelector("ul").innerHTML = "";

      // Update the frontend with the fetched tasks
      data.forEach((task) => {
        const task_el = createTaskElement(task);
        list_el.querySelector("ul").appendChild(task_el);
        taskCount += 1; // Increase task count by 1 for each task fetched
        
      });

      // Update the counter with the total task count
      counter.textContent = taskCount;
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });

  // Form submission event listener
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskTitle = input.value.trim();
    if (taskTitle !== "") {
   addNewTask({ title: taskTitle, completed: false });
      input.value = "";
    }
  });
});

// Updating Light and Dark colors
darkLightColor();
function darkLightColor() {
  let darkElements = document.querySelectorAll(".dark");
  let image = document.querySelector('.label');
  let background = document.querySelector(".background");
  let num = 0;

  image.addEventListener('click', () => {
    if (num === 0) {
      document.body.style.backgroundColor = '#171823';
      background.style.backgroundImage = "url('./images/bg-desktop-dark.jpg')";

      for (let i = 0; i < darkElements.length; i++) {
        darkElements[i].classList.add("darkElement");
      }
      num = 1;
    } else {
      document.body.style.backgroundColor = 'rgba(250, 250, 250, 1)';
      background.style.backgroundImage = "url('./images/bg-desktop-light.jpg')";
      for (let i = 0; i < darkElements.length; i++) {
        darkElements[i].classList.remove("darkElement");
      }
      num = 0;
    }
  });
  
}

