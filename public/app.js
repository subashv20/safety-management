// Variables to store tasks and workflow
let workflow = [];

document.addEventListener('DOMContentLoaded', () => {
  const tasks = document.querySelectorAll('.task');
  const dropzone = document.getElementById('dropzone');
  const saveWorkflowBtn = document.getElementById('save-workflow');

  // Enable dragging for tasks
  tasks.forEach(task => {
    task.addEventListener('dragstart', dragStart);
  });

  // Handle drag events for dropzone
  dropzone.addEventListener('dragover', dragOver);
  dropzone.addEventListener('drop', dropTask);

  // Save workflow on button click
  saveWorkflowBtn.addEventListener('click', saveWorkflow);
});

// Drag start handler
function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.task);
}

// Drag over handler
function dragOver(e) {
  e.preventDefault();
}

// Drop handler
function dropTask(e) {
  e.preventDefault();
  const taskName = e.dataTransfer.getData('text/plain');
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.textContent = taskName;
  dropzone.appendChild(taskElement);
  workflow.push({ task: taskName });
  renderPreview();
}

// Render the workflow preview
function renderPreview() {
  const previewContent = document.getElementById('preview-content');
  previewContent.innerHTML = '';
  workflow.forEach((step, index) => {
    const stepElement = document.createElement('div');
    stepElement.textContent = `Step ${index + 1}: ${step.task}`;
    previewContent.appendChild(stepElement);
  });
}

// Save workflow to the backend
function saveWorkflow() {
  fetch('/saveWorkflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ workflow })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Workflow saved successfully!');
        workflow = [];
        document.getElementById('dropzone').innerHTML = '';
        renderPreview();
      } else {
        alert('Error saving workflow');
      }
    });
}
