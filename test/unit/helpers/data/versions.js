/*
 * Copyright (c) 2016 Michael Krotscheck.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains test data for fetchMock, to simplify bootstrapping of unit tests for
 * cross-service version detection.
 */

/**
 * URLs to match the test data below.
 */
const rootUrl = "http://example.com/";
const subUrl = `${rootUrl}v1`;

/**
 * A mock list of supported versions for the below requests.
 *
 * @type {Array}
 */
const versions = [
  'v2.3'
];

/**
 * Build a new FetchMock configuration for the versions (root) endpoint.
 *
 * @returns {{}} A full FetchMock configuration for a versions resource.
 */
function rootResponse() {
  return {
    method: 'GET',
    matcher: rootUrl,
    response: {
      versions: [
        {
          status: "CURRENT",
          id: "v2.3",
          links: [
            {
              href: `${rootUrl}v2/`,
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v2.2",
          links: [
            {
              href: `${rootUrl}v2/`,
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v2.1",
          links: [
            {
              href: `${rootUrl}v2/`,
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v2.0",
          links: [
            {
              href: `${rootUrl}v2/`,
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v1.1",
          links: [
            {
              href: `${rootUrl}v1/`,
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v1.0",
          links: [
            {
              href: `${rootUrl}v1/`,
              rel: "self"
            }
          ]
        }
      ]
    }
  };
}

/**
 * FetchMock configuration for a 401 response against the versioned API url.
 *
 * @param {int} httpStatus The HTTP status for the response.
 * @returns {{}} A full FetchMock configuration a failing request..
 */
function subResponse(httpStatus = 401) {
  return {
    method: 'GET',
    matcher: subUrl,
    response: {
      status: httpStatus
    }
  };
}

export {
  rootUrl,
  subUrl,
  versions,
  rootResponse,
  subResponse
};
