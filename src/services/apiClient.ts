/**
 * ST² Student Growth Hub - API Client & Configuration Layer
 * 
 * Supports seamless switching between DEMO MODE (local mock data & localStorage)
 * and API MODE (calling backend endpoints via VITE_API_BASE_URL).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const DEFAULT_API_MODE = import.meta.env.VITE_ENABLE_API_MODE === 'true';

class ApiClient {
  private baseUrl: string;
  private isApiMode: boolean;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // Check localStorage preference, fallback to env variable
    const savedMode = localStorage.getItem('st2_api_mode') ?? localStorage.getItem('bytexl_api_mode');
    this.isApiMode = savedMode !== null ? savedMode === 'true' : DEFAULT_API_MODE;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  public isUsingApiMode(): boolean {
    return this.isApiMode;
  }

  public setApiMode(enabled: boolean): void {
    this.isApiMode = enabled;
    localStorage.setItem('st2_api_mode', String(enabled));
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.isApiMode) {
      throw new Error(`API mode is currently disabled. Running in DEMO mode.`);
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = localStorage.getItem('st2_auth_token') ?? localStorage.getItem('bytexl_auth_token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `API request failed with HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
