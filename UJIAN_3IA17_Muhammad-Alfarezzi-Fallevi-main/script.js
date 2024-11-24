function fetchTasks() {
  fetch('http://localhost:3000/tasks')
      .then(response => response.json())
      .then(tasks => {
          const taskList = document.getElementById('taskList');
          taskList.innerHTML = ''; // Kosongkan tabel
          tasks.forEach(task => {
              const newRow = taskList.insertRow();
              newRow.setAttribute('id', task._id);

              const cell1 = newRow.insertCell(0);
              const cell2 = newRow.insertCell(1);
              const cell3 = newRow.insertCell(2);
              const cell4 = newRow.insertCell(3);

              cell1.innerHTML = task.subject;
              cell2.innerHTML = task.deadline;
              cell3.innerHTML = task.status;
              cell4.innerHTML = `<button onclick="handleEdit('${task._id}')">Edit</button>
                                 <button onclick="handleDelete('${task._id}')">Delete</button>`;
          });
      })
      .catch(error => console.error('Error fetching tasks:', error));
}

function handleSave() {
  const subject = document.getElementById('subject').value;
  const deadline = document.getElementById('deadline').value;
  const status = document.getElementById('status').value;

  if (subject && deadline && status) {
      const newTask = { subject, deadline, status };

      fetch('http://localhost:3000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
      })
          .then(response => response.json())
          .then(() => {
              fetchTasks(); // Refresh data setelah simpan
              document.getElementById('subject').value = '';
              document.getElementById('deadline').value = '';
              document.getElementById('status').value = 'Belum Mulai';
          })
          .catch(error => console.error('Error saving task:', error));
  }
}

function handleEdit(taskId) {
  const row = document.getElementById(taskId);
  const subject = row.cells[0].innerHTML;
  const deadline = row.cells[1].innerHTML;
  const status = row.cells[2].innerHTML;

  document.getElementById('subject').value = subject;
  document.getElementById('deadline').value = deadline;
  document.getElementById('status').value = status;

  document.getElementById('saveButton').onclick = function () {
      handleUpdate(taskId);
  };
}

function handleUpdate(taskId) {
  const subject = document.getElementById('subject').value;
  const deadline = document.getElementById('deadline').value;
  const status = document.getElementById('status').value;

  if (subject && deadline && status) {
      const updatedTask = { subject, deadline, status };

      fetch(`http://localhost:3000/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask)
      })
          .then(response => response.json())
          .then(() => {
              fetchTasks(); // Refresh data setelah update
              document.getElementById('subject').value = '';
              document.getElementById('deadline').value = '';
              document.getElementById('status').value = 'Belum Mulai';
              document.getElementById('saveButton').onclick = handleSave;
          })
          .catch(error => console.error('Error updating task:', error));
  }
}

function handleDelete(taskId) {
  fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE'
  })
      .then(() => fetchTasks()) // Refresh data setelah delete
      .catch(error => console.error('Error deleting task:', error));
}

// Ambil data saat halaman pertama kali dimuat
window.onload = fetchTasks;
