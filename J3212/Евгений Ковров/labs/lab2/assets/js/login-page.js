(function (global) {
  const form = document.getElementById('loginForm');

  if (!form || !global.KontramarkaAuth) {
    return;
  }

  const { loginUser, isAuthenticated } = global.KontramarkaAuth;
  const errorBox = document.getElementById('loginError');
  const submitButton = document.getElementById('loginSubmit');

  function renderError(message) {
    if (!errorBox) {
      return;
    }

    if (!message) {
      errorBox.classList.add('d-none');
      errorBox.textContent = '';
      return;
    }

    errorBox.textContent = message;
    errorBox.classList.remove('d-none');
  }

  function setSubmittingState(isSubmitting) {
    if (!submitButton) {
      return;
    }

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? 'Входим...' : 'Войти';
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    renderError('');

    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    if (!email || !password) {
      renderError('Заполните email и пароль.');
      return;
    }

    setSubmittingState(true);

    try {
      await loginUser({ email, password });
      global.location.href = 'index.html';
    } catch (error) {
      renderError(error.message || 'Не удалось выполнить вход.');
    } finally {
      setSubmittingState(false);
    }
  }

  if (isAuthenticated()) {
    global.location.href = 'index.html';
    return;
  }

  form.addEventListener('submit', handleLoginSubmit);
})(window);
