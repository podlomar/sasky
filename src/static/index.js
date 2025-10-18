document.getElementById('addEntryBtn').addEventListener('click', function () {
  const form = document.getElementById('addEntryForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
  if (form.style.display === 'block') {
    form.scrollIntoView({ behavior: 'smooth' });
  }
});

// Cancel button
document.getElementById('cancelBtn').addEventListener('click', function () {
  document.getElementById('addEntryForm').style.display = 'none';
});

// Hide messages after 5 seconds
setTimeout(function () {
  const messages = document.querySelectorAll('.message');
  messages.forEach(function (message) {
    message.style.display = 'none';
  });
}, 5000);
