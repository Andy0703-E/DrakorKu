import axios from 'axios';

// Base URL for Wudysoft API
export const api = axios.create({
  baseURL: 'https://wudyver-api.vercel.app/api',
  timeout: 15000,
});

export const fetchDrakorList = async (page = 1) => {
  const response = await api.get('/film/drakor/v7', {
    params: { action: 'latest', page }
  });
  return response.data;
};

export const fetchOngoingDrakor = async (page = 1) => {
  const response = await api.get('/film/drakor/v7', {
    params: {
      action: 'ongoing',
      page
    }
  });

  return response.data;
};

export const fetchRecommendedDrakor = async (page = 1) => {
  const response = await api.get('/film/drakor/v7', {
    params: {
      action: 'recommended',
      page
    }
  });

  return response.data;
};

export const fetchMovieDrakor = async (page = 1) => {
  const response = await api.get('/film/drakor/v7', {
    params: { action: 'origin_film', page }
  });

  return response.data;
};

export const searchDrakor = async (q, page = 1) => {
  const response = await api.get('/film/drakor/v7', {
    params: {
      action: 'search',
      q,
      page,
      type: 1,
      order: 1
    }
  });

  return response.data;
};


export const fetchDrakorInfo = async (id) => {
  const response = await api.get('/film/drakor/v7', {
    params: { action: 'get_info', id }
  });
  return response.data;
};

export const fetchEpisodes = async (id) => {
  const response = await api.get('/film/drakor/v7', {
    params: { action: 'get_episodes', id }
  });
  return response.data;
};

export const fetchStreamingLink = async (streamingId, movieId, epNumber) => {
  const response = await api.get('/film/drakor/v7', {
    params: {
      action: 'download_link',
      streaming: streamingId,
      movie_id: movieId,
      episode_number: epNumber
    }
  });
  return response.data;
};