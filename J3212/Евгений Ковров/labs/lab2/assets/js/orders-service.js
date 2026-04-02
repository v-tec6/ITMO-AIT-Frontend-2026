(function (global) {
  if (!global.KontramarkaApi || !global.KontramarkaApi.apiClient) {
    throw new Error('API client is required to initialize orders service.');
  }

  const { apiClient } = global.KontramarkaApi;

  async function createOrder(orderData) {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  }

  async function getOrdersByUser(userId) {
    const response = await apiClient.get('/orders', {
      params: {
        userId
      }
    });

    return response.data;
  }

  async function updateEventTickets(eventId, newAvailableTickets) {
    const currentEventResponse = await apiClient.get(`/events/${eventId}`);
    const response = await apiClient.put(`/events/${eventId}`, {
      ...currentEventResponse.data,
      availableTickets: Number(newAvailableTickets)
    });

    return response.data;
  }

  global.KontramarkaOrdersService = {
    createOrder,
    getOrdersByUser,
    updateEventTickets
  };
})(window);
