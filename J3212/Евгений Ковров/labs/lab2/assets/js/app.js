(function () {
  const buyEventName = document.getElementById('buyEventName');
  const buyConfirmButton = document.getElementById('buyConfirmButton');

  document.addEventListener('click', (event) => {
    const buyButton = event.target.closest('[data-buy]');

    if (!buyButton || !buyEventName) {
      return;
    }

    const title = buyButton.getAttribute('data-title') || 'Мероприятие';
    buyEventName.textContent = title;
  });

  if (buyConfirmButton) {
    buyConfirmButton.addEventListener('click', () => {
      buyConfirmButton.disabled = true;
      buyConfirmButton.textContent = 'Оформлено';

      setTimeout(() => {
        buyConfirmButton.disabled = false;
        buyConfirmButton.textContent = 'Подтвердить покупку';
      }, 1200);
    });
  }
})();
