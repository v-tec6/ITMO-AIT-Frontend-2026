import apiClient from './axios';

export async function fetchEvents() {
  const response = await apiClient.get('/events');
  return response.data;
}

export async function fetchEventById(id) {
  const response = await apiClient.get(`/events/${id}`, {
    params: {
      _ts: Date.now()
    }
  });

  return response.data;
}
