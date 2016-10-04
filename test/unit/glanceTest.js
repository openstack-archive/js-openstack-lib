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

import Glance from "../../src/glance.js";
import * as mockData from "./helpers/data/glance";
import fetchMock from "fetch-mock";

describe('Glance', () => {

  afterEach(fetchMock.restore);

  it('should export a class', () => {
    const glance = new Glance(mockData.config);
    expect(glance).toBeDefined();
  });

  it('should throw an error for an empty config', () => {
    expect(() => new Glance()).toThrow();
  });

  describe("version()", () => {
    it("Should return a supported version of the glance API.", (done) => {
      const glance = new Glance(mockData.config);

      fetchMock.mock(mockData.root());

      glance.version()
        .then((version) => {
          expect(version.id).toEqual('v2.3');
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("serviceEndpoint()", () => {
    it("Should return a valid endpoint to the glance API.", (done) => {
      const glance = new Glance(mockData.config);

      fetchMock.mock(mockData.root());

      glance.serviceEndpoint()
        .then((endpoint) => {
          expect(endpoint).toEqual('http://192.168.99.99:9292/v2/');
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("imageList()", () => {
    let glance = null;

    beforeEach(() => {
      fetchMock.mock(mockData.root());
      glance = new Glance(mockData.config);
    });

    it("should return the images as an array.", (done) => {
      const token = 'test_token';

      fetchMock.mock(mockData.imageList(token));
      glance
        .imageList(token)
        .then((images) => {
          expect(images.length).not.toBe(0);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should not cache its results", (done) => {
      const token = 'test_token';

      let mockOptions = mockData.imageList(token);
      fetchMock.mock(mockOptions);

      glance
        .imageList(token)
        .then(() => {
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(1);
          return glance.imageList(token);
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });
});
