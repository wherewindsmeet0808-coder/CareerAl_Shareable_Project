const API_BASE = '/api';

export async function apiRequest<T = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    isFormData?: boolean;
  } = {}
): Promise<{ success: boolean; data?: T; error?: string; [key: string]: any }> {
  const token = localStorage.getItem('ai_career_token');
  const headers: Record<string, string> = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: result.error || `Request failed with status ${response.status}`,
      };
    }

    return result;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error occurred. Please verify backend is running.',
    };
  }
}
