(function (global) {
  const pageContainer = document.getElementById('eventDetailsPage');

  if (!pageContainer || !global.KontramarkaEventsService || !global.KontramarkaOrdersService) {
    return;
  }

  const { getEventById } = global.KontramarkaEventsService;
  const { createOrder, updateEventTickets } = global.KontramarkaOrdersService;
  let currentEvent = null;
  let pageMessage = null;
  let isPurchasing = false;

  function getEventIdFromQuery() {
    const params = new URLSearchParams(global.location.search);
    const rawId = params.get('id');
    const eventId = Number(rawId);

    if (!rawId || !Number.isInteger(eventId) || eventId <= 0) {
      return null;
    }

    return eventId;
  }

  function formatEventDate(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  }

  function renderState(title, message, stateClass) {
    pageContainer.innerHTML = `
      <div class="border rounded-4 p-4 p-lg-5 text-center ${stateClass}">
        <h1 class="h4 fw-semibold mb-2">${title}</h1>
        <p class="mb-0">${message}</p>
      </div>
    `;
  }

  function getAvailabilityMarkup(event) {
    if (event.availableTickets <= 0) {
      return '<span class="badge text-bg-danger">Билеты закончились</span>';
    }

    return `<span class="badge bg-body-tertiary border">Доступно: ${event.availableTickets}</span>`;
  }

  function getLoginRedirectUrl() {
    const returnUrl = `${global.location.pathname.split('/').pop()}${global.location.search}`;
    return `login.html?redirect=${encodeURIComponent(returnUrl)}`;
  }

  function renderMessage() {
    if (!pageMessage) {
      return '';
    }

    return `
      <div class="alert alert-${pageMessage.type} mb-4" role="alert">
        ${pageMessage.text}
      </div>
    `;
  }

  function setPageMessage(type, text) {
    if (!type || !text) {
      pageMessage = null;
      return;
    }

    pageMessage = {
      type,
      text
    };
  }

  function renderEvent(event) {
    const isSoldOut = event.availableTickets <= 0;
    const buyButtonText = isSoldOut ? 'Билеты закончились' : (isPurchasing ? 'Оформляем...' : 'Купить билет');
    const buyButtonAttributes = isSoldOut
      ? 'class="btn btn-secondary" type="button" disabled'
      : `class="btn btn-primary" type="button" data-action="buy-ticket" data-buy="e${event.id}" data-title="${event.title}"${isPurchasing ? ' disabled' : ''}`;

    document.title = `Контрамарка — ${event.title}`;

    pageContainer.innerHTML = `
      ${renderMessage()}
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-3">
          <li class="breadcrumb-item"><a href="index.html">События</a></li>
          <li class="breadcrumb-item active" aria-current="page">${event.title}</li>
        </ol>
      </nav>

      <div class="row g-4 align-items-start">
        <div class="col-lg-7">
          <div class="border rounded-4 p-3 p-lg-4">
            <div class="d-flex flex-wrap gap-2 align-items-center mb-2">
              <span class="badge bg-body-tertiary border">${event.category}</span>
              ${getAvailabilityMarkup(event)}
            </div>

            <h1 class="h3 fw-semibold mb-2">${event.title}</h1>
            <div class="text-secondary mb-3">${event.city} • ${formatEventDate(event.date)} • ${event.time}</div>

            <p class="mb-0 text-secondary">
              ${event.description}
            </p>

            <hr>

            <div class="d-flex flex-column flex-sm-row gap-2">
              <button ${buyButtonAttributes}>
                ${buyButtonText}
              </button>
              <button class="btn btn-outline-secondary" type="button" data-bs-toggle="modal" data-bs-target="#shareModal">
                Поделиться
              </button>
              <button class="btn btn-outline-secondary" type="button">
                ❤ В избранное
              </button>
            </div>
          </div>

          <div class="border rounded-4 p-3 p-lg-4 mt-4">
            <h2 class="h6 mb-3">Отзывы</h2>

            <div class="d-flex gap-3">
              <div class="rounded-circle bg-body-tertiary border" style="width:40px;height:40px;"></div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="fw-semibold">Мария Андреева</div>
                  <div class="text-secondary small">1 день назад</div>
                </div>
                <div class="text-warning small">★★★★★</div>
                <div class="text-secondary mt-1">
                  Удобная площадка и хорошая организация. Событие оставило приятное впечатление.
                </div>
              </div>
            </div>

            <hr>

            <div class="d-flex gap-3">
              <div class="rounded-circle bg-body-tertiary border" style="width:40px;height:40px;"></div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="fw-semibold">Илья Громов</div>
                  <div class="text-secondary small">3 дня назад</div>
                </div>
                <div class="text-warning small">★★★★☆</div>
                <div class="text-secondary mt-1">
                  Понравилась атмосфера и понятная навигация на площадке. На вход лучше приходить заранее.
                </div>
              </div>
            </div>

            <hr>

            <button class="btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#reviewModal">
              Оставить отзыв
            </button>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="border rounded-4 p-3 p-lg-4">
            <h2 class="h6 mb-3">Место проведения</h2>

            <div class="fw-semibold">${event.venue}</div>
            <div class="text-secondary">${event.city}</div>

            <div class="mt-3 border rounded-4 overflow-hidden bg-body-tertiary">
              <img
                src="${event.image}"
                alt="${event.title}"
                class="w-100"
                style="height: 220px; object-fit: cover;"
              >
            </div>

            <hr>

            <h3 class="h6 mb-2">Информация</h3>
            <div class="border rounded-4 p-3 bg-body-tertiary">
              <div class="d-flex justify-content-between small">
                <span class="text-secondary">Дата</span>
                <span>${formatEventDate(event.date)}</span>
              </div>
              <div class="d-flex justify-content-between small mt-2">
                <span class="text-secondary">Время</span>
                <span>${event.time}</span>
              </div>
              <div class="d-flex justify-content-between small mt-2">
                <span class="text-secondary">Категория</span>
                <span>${event.category}</span>
              </div>
              <div class="d-flex justify-content-between small mt-2">
                <span class="text-secondary">Билеты</span>
                <span>${event.availableTickets > 0 ? `${event.availableTickets} шт.` : 'Нет в наличии'}</span>
              </div>
            </div>

            <hr>

            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="text-secondary small">Цена</div>
                <div class="h5 mb-0 fw-semibold">от ${event.price.toLocaleString('ru-RU')} ₽</div>
              </div>
              <button ${buyButtonAttributes}>
                ${isSoldOut ? 'Нет билетов' : (isPurchasing ? 'Оформляем...' : 'Купить')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const shareEventLink = document.getElementById('shareEventLink');

    if (shareEventLink) {
      shareEventLink.value = global.location.href;
    }
  }

  async function handleBuyTicket() {
    if (!currentEvent || isPurchasing) {
      return;
    }

    if (currentEvent.availableTickets <= 0) {
      setPageMessage('warning', 'Билеты на это мероприятие закончились.');
      renderEvent(currentEvent);
      return;
    }

    if (!global.KontramarkaAuth || !global.KontramarkaAuth.isAuthenticated()) {
      global.location.href = getLoginRedirectUrl();
      return;
    }

    isPurchasing = true;
    setPageMessage(null, null);
    renderEvent(currentEvent);

    try {
      const currentUser = global.KontramarkaAuth.getCurrentUser();

      await createOrder({
        userId: currentUser.id,
        eventId: currentEvent.id,
        quantity: 1,
        totalPrice: currentEvent.price,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      });

      const updatedEvent = await updateEventTickets(currentEvent.id, currentEvent.availableTickets - 1);
      currentEvent = updatedEvent;
      setPageMessage('success', 'Покупка оформлена. Заказ создан, а билет добавлен в ваши покупки.');
    } catch (error) {
      console.error('Ticket purchase failed.', error);
      setPageMessage('danger', 'Не удалось оформить билет. Попробуйте ещё раз.');
    } finally {
      isPurchasing = false;
      renderEvent(currentEvent);
    }
  }

  pageContainer.addEventListener('click', (event) => {
    const buyButton = event.target.closest('[data-action="buy-ticket"]');

    if (!buyButton) {
      return;
    }

    handleBuyTicket();
  });

  async function initEventPage() {
    renderState('Загрузка мероприятия...', 'Получаем данные события из mock API.', 'text-secondary');

    const eventId = getEventIdFromQuery();

    if (!eventId) {
      renderState('Некорректная ссылка', 'Не удалось открыть мероприятие по этой ссылке.', 'text-danger');
      return;
    }

    try {
      const event = await getEventById(eventId);
      currentEvent = event;
      renderEvent(event);
    } catch (error) {
      console.error('Event loading failed.', error);

      if (error.response && error.response.status === 404) {
        renderState('Мероприятие не найдено', 'Событие не найдено или было удалено.', 'text-warning');
        return;
      }

      renderState('Ошибка загрузки', 'Не удалось загрузить данные мероприятия. Попробуйте позже.', 'text-danger');
    }
  }

  initEventPage();
})(window);
