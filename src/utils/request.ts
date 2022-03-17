import 'whatwg-fetch';
import qs from 'qs';
import { get, isEmpty, isObject, merge } from 'lodash';
import { safeParseJSON } from './index';

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * This is our overly complicated isomorphic "request",
 * methods: get, post, put, patch, delete.
 * @param url
 * @param params
 * @param options
 * @param reject
 * @returns {Function}
 */
export const request = methods.reduce(
  (prev, method) => ({
    ...prev,
    [method.toLowerCase()]: (url, params = {}, options, reject, handler) =>
      buildRequest({ method, url, params, options, reject, handler }),
  }),
  {
    defaults: buildRequest,
    watch: watchResource,
  }
);

/**
 * Build and execute remote request.
 * @param method
 * @param url
 * @param params
 * @param config
 */
function buildRequest({
  method = 'GET',
  url,
  params = {},
  options,
  reject,
  handler,
}) {
  let requestURL = createURL(url);
  const request = merge(
    {
      method,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'content-type':
          method === 'PATCH'
            ? 'application/merge-patch+json'
            : 'application/json',
      },
    },
    options
  );

  const isForm =
    get(options, 'headers[content-type]', '').indexOf(
      'application/x-www-form-urlencoded'
    ) !== -1;

  if (method === 'GET') {
    if (!isEmpty(params)) {
      requestURL += `?${qs.stringify(params)}`;
    }
  } else if (isForm) {
    request.body = qs.stringify(params);
  } else {
    // if (method === 'POST' && params.metadata) {
    //   set(
    //     params,
    //     'metadata.annotations["metasphere.io/creator"]',
    //     globals.user.username
    //   );
    // }
    request.body = JSON.stringify(params);
  }

  let responseHandler = handleResponse;

  if (typeof handler === 'function') {
    responseHandler = handler;
  }

  return fetch(requestURL, request).then((resp) =>
    responseHandler(resp, reject)
  );
}

function watchResource(url, params = {}, callback) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `/${url}?${qs.stringify(params)}`, true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState >= 3 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };

  xhr.send();

  return xhr;
}

/**
 * Prepend host of API server
 * @param path
 * @returns {String}
 * @private
 */
function createURL(path) {
  if (path.startsWith('http')) {
    return path;
  }

  return `/${path.trimLeft('/')}`;
}

/**
 * Decide what to do with the response
 * @param response
 * @param reject
 * @returns {Promise}
 * @private
 */
function handleResponse(response, reject) {
  const redirect = response.redirected;
  if (redirect) {
    window.location.replace(response.url);
    return Promise.reject();
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('json')) {
    return response.json().then((data) => {
      if (response.status === 401) {
        console.warn('Unauthorized', response, response.ok);
      }

      if (response.ok && response.status >= 200 && response.status < 400) {
        return data;
      }

      const error = formatError(response, data);

      if (typeof reject === 'function') {
        return reject(error, response);
      }

      if (window.onunhandledrejection) {
        // @ts-ignore
        window.onunhandledrejection(error);
      }

      return Promise.reject(error);
    });
  }

  if (response.status === 200 || response.status === 204) {
    return response.text();
  }

  return response.text().then((text) => {
    const error = formatTextError(response, text);

    if (typeof reject === 'function') {
      return reject(response, error);
    }

    if (window.onunhandledrejection) {
      // @ts-ignore
      window.onunhandledrejection(error);
    }

    return Promise.reject(error);
  });
}

function formatError(response, data) {
  if (data.code < 100) {
    data.code = 500;
  }

  const result = {
    status: response.status,
    reason: response.statusText,
    message: '',
  };

  if (typeof data.code === 'number') {
    result.status = data.code;
  }

  if (data.status) {
    result.status = data.status;
  }

  if (data.reason || data.error) {
    result.reason = data.reason || data.error;
  }

  result.message = data.message || data.Error || JSON.stringify(data.details);

  return result;
}

function formatTextError(response, text) {
  let error = {
    code: '',
    status: response.status,
    reason: response.statusText,
    message: text,
    errors: [],
  };

  // @ts-ignore
  const errorBody = safeParseJSON(text);

  if (isObject(errorBody) && !isEmpty(errorBody)) {
    error = {
      ...error,
      code: errorBody.code,
      message: errorBody.message,
      errors: errorBody.errors,
    };
  }

  return error;
}
