/* todo.js - To-Do app logic (clean & commented) */

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const list = document.getElementById('list');
  const clearAll = document.getElementById('clearAll');
  const filterSelect = document.getElementById('filterSelect');

  let tasks = JSON.parse(localStorage.getItem('tasks_v3') || '[]');

  function save() { localStorage.setItem('tasks_v3', JSON.stringify(tasks)); }

  // Render tasks according to filter
  function render(filter = 'all') {
    list.innerHTML = '';
    const view = tasks.filter(t => filter === 'all' ? true : (filter === 'done' ? t.done : !t.done));
    if (view.length === 0) {
      list.innerHTML = '<div class="small">No tasks yet.</div>';
      return;
    }
    view.forEach((t, idx) => {
      const el = document.createElement('div');
      el.className = 'task card' + (t.done ? ' done' : '');
      el.innerHTML = `
        <div class="meta" style="display:flex;gap:12px;align-items:center">
          <input type="checkbox" ${t.done ? 'checked' : ''} data-idx="${idx}">
          <div>
            <strong>${escapeHTML(t.text)}</strong>
            <div class="small">${new Date(t.created).toLocaleString()}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn ghost" data-act="edit" data-idx="${idx}">Edit</button>
          <button class="btn" data-act="del" data-idx="${idx}">Delete</button>
        </div>
      `;
      list.appendChild(el);
    });
  }

  function escapeHTML(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  addBtn.addEventListener('click', () => {
    const val = taskInput.value.trim();
    if (!val) return;
    tasks.unshift({ text: val, done: false, created: Date.now() });
    save(); taskInput.value = ''; render(filterSelect.value);
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) {
      const idx = Number(btn.dataset.idx);
      if (btn.dataset.act === 'del') { tasks.splice(idx, 1); save(); render(filterSelect.value); return; }
      if (btn.dataset.act === 'edit') {
        const val = prompt('Edit task', tasks[idx].text);
        if (val !== null) { tasks[idx].text = val; save(); render(filterSelect.value); }
      }
    }
    const chk = e.target.closest('input[type="checkbox"]');
    if (chk) { tasks[Number(chk.dataset.idx)].done = chk.checked; save(); render(filterSelect.value); }
  });

  clearAll.addEventListener('click', () => {
    if (confirm('Clear all tasks?')) { tasks = []; save(); render(); }
  });

  filterSelect.addEventListener('change', () => render(filterSelect.value));

  // Initial render
  render();
});