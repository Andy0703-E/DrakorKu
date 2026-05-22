import axios from 'axios';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

const USE_PROXY = import.meta.env.PROD;

async function apiCall(params) {
  if (USE_PROXY) {
    const { data } = await axios.get('/api/drakor', { params, timeout: 15000 });
    return data;
  }
  const { data } = await axios.get('https://wudyver-api.vercel.app/api/film/drakor/v7', { params, timeout: 15000 });
  return data;
}

export const fetchDrakorList = async (page = 1) => {
  const cacheKey = `latest-${page}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const data = await apiCall({ action: 'latest', page });
  setCache(cacheKey, data);
  return data;
};

export const fetchOngoingDrakor = async (page = 1) => {
  const cacheKey = `ongoing-${page}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const data = await apiCall({ action: 'ongoing', page });
  setCache(cacheKey, data);
  return data;
};

export const fetchRecommendedDrakor = async (page = 1) => {
  const cacheKey = `recommended-${page}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const data = await apiCall({ action: 'recommended', page });
  setCache(cacheKey, data);
  return data;
};

export const fetchMovieDrakor = async (page = 1) => {
  const cacheKey = `movie-${page}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const data = await apiCall({ action: 'origin_film', page });
  setCache(cacheKey, data);
  return data;
};

export const searchDrakor = async (q, page = 1) => {
  const cacheKey = `search-${q}-${page}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const data = await apiCall({ action: 'search', q, page, type: 1, order: 1 });
  setCache(cacheKey, data);
  return data;
};

export const fetchDrakorInfo = async (id) => {
  const cacheKey = `info-${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const data = await apiCall({ action: 'get_info', id });
  setCache(cacheKey, data);
  return data;
};

export const fetchEpisodes = async (id) => {
  const cacheKey = `episodes-${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const data = await apiCall({ action: 'get_episodes', id });
  setCache(cacheKey, data);
  return data;
};

export const fetchStreamingLink = async (streamingId, movieId, epNumber) => {
  const cacheKey = `stream-${streamingId}-${movieId}-${epNumber}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const data = await apiCall({
    action: 'download_link',
    streaming: streamingId,
    movie_id: movieId,
    episode_number: epNumber,
  });
  setCache(cacheKey, data);
  return data;
};
