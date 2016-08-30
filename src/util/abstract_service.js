/*
 * Copyright (c) 2016 Hewlett Packard Enterprise Development L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See
 * the License for the specific language governing permissions and limitations
 * under the License.
 */

import Http from './http';

/**
 * An abstract implementation of our services, which includes logic common to all of our services.
 *
 * @author Michael Krotscheck
 */
export default class AbstractService {

  /**
   * Our HTTP service instance.
   *
   * @returns {Http} Our HTTP service instance.
   */
  get http () {
    if (!this._http) {
      this._http = new Http();
    }
    return this._http;
  }
}
