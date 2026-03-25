(function (global) {
  const pageContent = document.getElementById('ordersPageContent');

  if (
    !pageContent ||
    !global.KontramarkaAuth ||
    !global.KontramarkaOrdersService ||
    !global.KontramarkaEventsService
  ) {
    return;
  }

  const { getCurrentUser, isAuthenticated } = global.KontramarkaAuth;
  const { getOrdersByUser } = global.KontramarkaOrdersService;
  const { getEventById } = global.KontramarkaEventsService;

  function getLoginRedirectUrl() {
    return `login.html?redirect=${encodeURIComponent('orders.html')}`;
  }

  function formatDateTime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatEventDate(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  function renderState(title, message, stateClass) {
    pageContent.innerHTML = `
      <div class="border rounded-4 p-4 p-lg-5 text-center ${stateClass}">
        <h2 class="h5 fw-semibold mb-2">${title}</h2>
        <p class="mb-0">${message}</p>
      </div>
    `;
  }

  function getStatusMarkup(status) {
    if (status === 'confirmed') {
      return '<span class="badge text-bg-success">Подтверждён</span>';
    }

    if (status === 'cancelled') {
      return '<span class="badge text-bg-secondary">Отменён</span>';
    }

    return `<span class="badge bg-body-tertiary border">${status}</span>`;
  }

  function createOrderCard(orderWithEvent) {
    const { order, event } = orderWithEvent;
    const eventInfo = event
      ? `
        <div class="fw-semibold">${event.title}</div>
        <div class="text-secondary small">${event.city} • ${event.venue}</div>
        <div class="text-secondary small mt-1">${formatEventDate(event.date)} • ${event.time}</div>
      `
      : `
        <div class="fw-semibold">Информация о мероприятии недоступна</div>
        <div class="text-secondary small">Событие с id ${order.eventId} не найдено в mock API.</div>
      `;

    return `
      <div class="border rounded-4 p-3 p-lg-4">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
          <div>
            ${eventInfo}
          </div>
          <div class="text-lg-end">
            ${getStatusMarkup(order.status)}
            <div class="text-secondary small mt-2">Заказ от ${formatDateTime(order.createdAt)}</div>
          </div>
        </div>

        <hr>

        <div class="row g-3 small">
          <div class="col-sm-4">
            <div class="text-secondary">Количество билетов</div>
            <div class="fw-semibold">${order.quantity}</div>
          </div>
          <div class="col-sm-4">
            <div class="text-secondary">Сумма</div>
            <div class="fw-semibold">${order.totalPrice.toLocaleString('ru-RU')} ₽</div>
          </div>
          <div class="col-sm-4">
            <div class="text-secondary">Номер заказа</div>
            <div class="fw-semibold">#${order.id}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderOrders(ordersWithEvents) {
    pageContent.innerHTML = `
      <div class="d-grid gap-3">
        ${ordersWithEvents.map(createOrderCard).join('')}
      </div>
    `;
  }

  async function loadOrderEvent(order) {
    try {
      const event = await getEventById(order.eventId);
      return { order, event };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { order, event: null };
      }

      throw error;
    }
  }

  async function initOrdersPage() {
    if (!isAuthenticated()) {
      global.location.href = getLoginRedirectUrl();
      return;
    }

    renderState('Загрузка заказов...', 'Получаем ваши покупки и данные мероприятий.', 'text-secondary');

    try {
      const currentUser = getCurrentUser();
      const orders = await getOrdersByUser(currentUser.id);

      if (!orders.length) {
        renderState('Пока нет заказов', 'После покупки билетов они появятся на этой странице.', 'text-secondary');
        return;
      }

      const ordersWithEvents = await Promise.all(orders.map(loadOrderEvent));
      renderOrders(ordersWithEvents);
    } catch (error) {
      renderState('Ошибка загрузки', 'Не удалось получить ваши заказы. Проверьте, что json-server запущен на http://localhost:3000.', 'text-danger');
    }
  }

  initOrdersPage();
})(window);
