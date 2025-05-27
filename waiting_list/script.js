document.addEventListener('DOMContentLoaded', () => {
  const slotContainer = document.getElementById('slots');
  const startH = 6, startM = 30;
  const endH = 20, endM = 30;

  function format(h, m) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function buildSlots(blocked) {
    let h = startH, m = startM;
    while (h < endH || (h === endH && m < endM)) {
      const start = format(h, m);
      m += 30;
      if (m === 60) { m = 0; h += 1; }
      const end = format(h, m);
      const val = `${start}-${end}`;

      const label = document.createElement('label');
      if (blocked.includes(start)) label.classList.add('blocked');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'slots';
      checkbox.value = val;
      checkbox.disabled = blocked.includes(start);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + val));
      slotContainer.appendChild(label);
    }
  }

  fetch('slots')
    .then(r => r.json())
    .then(data => buildSlots(data.blocked || []));

  document.getElementById('waitForm').addEventListener('submit', e => {
    e.preventDefault();
    fetch('submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(e.target)).toString()
    })
    .then(res => res.text())
    .then(msg => { alert(msg); e.target.reset(); })
    .catch(() => alert('Error submitting form'));
  });
});
