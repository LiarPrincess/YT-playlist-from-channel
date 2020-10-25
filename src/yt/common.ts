import { GaxiosResponse } from 'gaxios';

export function validateResponse<T>(response: GaxiosResponse<T>) {
  if (!response.data) {
    if (response.status) {
      throw new Error(`Invalid response status: ${response.status}.`);
    }

    throw new Error('Invalid response received from YouTube api.');
  }
}
