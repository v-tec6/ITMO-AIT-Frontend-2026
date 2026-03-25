(function (global) {
  const catalogContainer = document.getElementById('eventsCatalog');

  if (!catalogContainer || !global.KontramarkaEventsService) {
    return;
  }

  const { getEvents } = global.KontramarkaEventsService;

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

  function getEventDetailsUrl(event) {
    return `event.html?id=${event.id}`;
  }

  function renderState(message, stateClass) {
    catalogContainer.innerHTML = `
      <div class="col-12">
        <div class="border rounded-4 p-4 text-center ${stateClass}">
          ${message}
        </div>
      </div>
    `;
  }

  function createEventCard(event) {
    return `
      <div class="col">
        <div class="card card-hover h-100 rounded-4 overflow-hidden">
          <img
            src="${event.image}"
            class="card-img-top"
            alt="${event.title}"
            style="height: 180px; object-fit: cover;"
          >
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h3 class="h6 mb-1">${event.title}</h3>
                <div class="text-secondary small">${event.city} • ${event.venue} • ${formatEventDate(event.date)} • ${event.time}</div>
              </div>
              <span class="badge bg-body-tertiary border">${event.category}</span>
            </div>
            <p class="mt-3 mb-0 text-secondary text-truncate-2">
              ${event.description}
            </p>
          </div>
          <div class="card-footer bg-transparent border-top-0 pt-0 pb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-semibold">от ${event.price.toLocaleString('ru-RU')} ₽</div>
              <div class="d-flex gap-2">
                <a class="btn btn-sm btn-outline-secondary" href="${getEventDetailsUrl(event)}">Подробнее</a>
                <button
                  class="btn btn-sm btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#buyModal"
                  data-buy="e${event.id}"
                  data-title="${event.title}"
                >
                  Купить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderEvents(events) {
    catalogContainer.innerHTML = events.map(createEventCard).join('');
  }

  async function initCatalogPage() {
    renderState('Загрузка мероприятий...', 'text-secondary');

    try {
      const events = await getEvents();

      if (!Array.isArray(events) || events.length === 0) {
        renderState('Пока нет доступных мероприятий.', 'text-secondary');
        return;
      }

      renderEvents(events);
    } catch (error) {
      renderState('Не удалось загрузить мероприятия. Проверьте, что json-server запущен на http://localhost:3000.', 'text-danger');
    }
  }

  initCatalogPage();
})(window);
