export function initTheme() {
  const toggleBtn1 = document.getElementById('theme-toggle');
  const toggleBtn2 = document.getElementById('mobile-theme-toggle');
  
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (toggleBtn1) toggleBtn1.innerHTML = t === 'light' ? '🌙' : '☀️';
    if (toggleBtn2) toggleBtn2.innerHTML = t === 'light' ? '🌙  Switch Mode' : '☀️  Switch Mode';
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  const toggleHandler = () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  };

  if (toggleBtn1) toggleBtn1.addEventListener('click', toggleHandler);
  if (toggleBtn2) toggleBtn2.addEventListener('click', toggleHandler);
}
