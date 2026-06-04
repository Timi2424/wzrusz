import { TestBed } from '@angular/core/testing';
import { getApiBaseUrl, apiUrl } from './api-config';

describe('api-config', () => {
  it('uses relative paths in browser dev when base URL is empty', () => {
    expect(apiUrl('/api/health')).toBe('/api/health');
  });

  it('getApiBaseUrl returns empty string in browser without injected URL', () => {
    expect(getApiBaseUrl()).toBe('');
  });
});
