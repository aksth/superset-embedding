import { SupersetClient, logging } from '@superset-ui/core';

export default function setupClient() {
  const csrfNode = document.querySelector<HTMLInputElement>('#csrf_token');
  const csrfToken = csrfNode?.value;

  // when using flask-jwt-extended csrf is set in cookies
  const cookieCSRFToken = '';

  let csrfTokenString = 'testString';
  let accessToken = 'testString';

  SupersetClient.configure({
    protocol: ['http:', 'https:'].includes(window?.location?.protocol)
      ? (window?.location?.protocol as 'http:' | 'https:')
      : undefined,
    mode: 'cors',
    host: (window.location && window.location.host) || '',
    csrfToken: csrfToken || cookieCSRFToken || csrfTokenString,
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .init()
    .catch(error => {
      logging.warn('Error initializing SupersetClient', error);
    });
}
