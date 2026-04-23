export function initForm() {
    const sendBtn = document.getElementById('sendBtn');
    if (!sendBtn) return;
    sendBtn.addEventListener('click', function() {
        const name    = (document.getElementById('contactName').value    || '').trim();
        const email   = (document.getElementById('contactEmail').value   || '').trim();
        const subject = (document.getElementById('contactSubject').value || '').trim();
        const message = (document.getElementById('contactMessage').value || '').trim();
      
        if (!name || !email || !message) {
          alert('Please fill in your name, email address, and message.');
          return;
        }
      
        const btn = this;
        const sendIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btn.innerHTML = 'Sending…';
        btn.disabled  = true;
      
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: 'a68dff58-7fdb-4766-b2d8-6630bc44ec9f',
            name:    name,
            email:   email,
            subject: subject || 'Portfolio enquiry from ' + name,
            message: message
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            btn.innerHTML = '✓ Sent!';
            btn.style.background = 'var(--green)';
            btn.style.color = '#000';
            const formMsg = document.getElementById('formMsg');
            if (formMsg) formMsg.style.display = 'block';
            document.getElementById('contactName').value    = '';
            document.getElementById('contactEmail').value   = '';
            document.getElementById('contactSubject').value = '';
            document.getElementById('contactMessage').value = '';
          } else {
            throw new Error(data.message || 'Submission failed');
          }
        })
        .catch(() => {
          btn.innerHTML = sendIcon + ' Send Message';
          btn.disabled  = false;
          alert('Could not send message. Please email me directly:\nsrinivasanpalanivel4@gmail.com');
        });
    });
}
