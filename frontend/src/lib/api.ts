import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export const apiRequest = async (endpoint: string, options: ApiRequestOptions = {}) => {
  const { method = 'GET', body, headers = {} } = options;

  try {
    // Get access token from Amplify
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    headers['Content-Type'] = 'application/json';

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};