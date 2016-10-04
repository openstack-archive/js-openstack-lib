import Keystone from '../../src/keystone.js';
import * as mockData from './helpers/data/keystone';
import fetchMock from 'fetch-mock';

describe('Keystone', () => {

  afterEach(fetchMock.restore);

  it('should export a class', () => {
    const keystone = new Keystone(mockData.config);
    expect(keystone).toBeDefined();
  });

  it('should throw an error for an empty config', () => {
    expect(() => new Keystone()).toThrow();
  });

  describe("versions()", () => {

    /**
     * Keystone needs an explicit test, as it uses a slightly different data format
     * than other services.
     */
    it("Should return a list of all versions available on this clouds' keystone", (done) => {
      const keystone = new Keystone(mockData.config);

      fetchMock.mock(mockData.root());

      keystone.versions()
        .then((versions) => {
          // Quick sanity check.
          expect(versions.length).toBe(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("version()", () => {

    it("Should return a supported version of the keystone API.", (done) => {
      const keystone = new Keystone(mockData.config);

      fetchMock.mock(mockData.root());

      keystone.version()
        .then((version) => {
          expect(version.id).toEqual('v3.7');
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("serviceEndpoint()", () => {
    it("Should return a valid endpoint to the keystone API.", (done) => {
      const keystone = new Keystone(mockData.config);

      fetchMock.mock(mockData.root());

      keystone.serviceEndpoint()
        .then((endpoint) => {
          expect(endpoint).toEqual('http://192.168.99.99/identity_v2_admin/v3/');
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("tokenIssue()", () => {

    it("should 'just work' by using provided credentials from the config.", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue()
        .then((token) => {
          expect(token).toEqual('test_token'); // From mock data
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("should support authentication with a user ID", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const userId = 'userId';

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue({
          user_id: userId
        })
        .then(() => {
          const requestBody = JSON.parse(fetchMock.lastCall(mockOptions.matcher)[1].body);
          expect(requestBody.auth.identity.password.user.id).toEqual(userId);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("should support authentication with a username and a user domain ID", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const username = 'username';
      const userDomainId = 'userDomainId';

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue({
          username: username,
          user_domain_id: userDomainId
        })
        .then(() => {
          const requestBody = JSON.parse(fetchMock.lastCall(mockOptions.matcher)[1].body);
          expect(requestBody.auth.identity.password.user.name).toEqual(username);
          expect(requestBody.auth.identity.password.user.domain.id).toEqual(userDomainId);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("should support authentication with a username and a user domain name", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const username = 'username';
      const userDomainName = 'userDomainName';

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue({
          username: username,
          user_domain_name: userDomainName
        })
        .then(() => {
          const requestBody = JSON.parse(fetchMock.lastCall(mockOptions.matcher)[1].body);
          expect(requestBody.auth.identity.password.user.name).toEqual(username);
          expect(requestBody.auth.identity.password.user.domain.name).toEqual(userDomainName);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("should support authentication with a project ID", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const projectId = 'projectId';

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue({
          project_id: projectId,
        })
        .then(() => {
          const requestBody = JSON.parse(fetchMock.lastCall(mockOptions.matcher)[1].body);
          expect(requestBody.auth.scope.project.id).toEqual(projectId);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("should support authentication with a project name and a project domain ID", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const projectName = 'projectName';
      const projectDomainId = 'projectDomainId';

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue({
          project_name: projectName,
          project_domain_id: projectDomainId
        })
        .then(() => {
          const requestBody = JSON.parse(fetchMock.lastCall(mockOptions.matcher)[1].body);
          expect(requestBody.auth.scope.project.name).toEqual(projectName);
          expect(requestBody.auth.scope.project.domain.id).toEqual(projectDomainId);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("should support authentication with a project name and a project domain name", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const projectName = 'projectName';
      const projectDomainName = 'projectDomainName';

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue({
          project_name: projectName,
          project_domain_name: projectDomainName
        })
        .then(() => {
          const requestBody = JSON.parse(fetchMock.lastCall(mockOptions.matcher)[1].body);
          expect(requestBody.auth.scope.project.name).toEqual(projectName);
          expect(requestBody.auth.scope.project.domain.name).toEqual(projectDomainName);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should not cache its results", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue()
        .then((token) => {
          expect(token).toEqual('test_token'); // From mock data
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(1);
          return keystone.tokenIssue();
        })
        .then((token) => {
          expect(token).toEqual('test_token'); // From mock data
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("tokenRevoke()", () => {
    let keystone = null;

    beforeEach(() => {
      fetchMock.mock(mockData.root());
      keystone = new Keystone(mockData.config);
    });

    it("should return a 204 response on a valid revocation.", (done) => {
      const token = 'test_token';
      const adminToken = 'test_admin_token';

      fetchMock.mock(mockData.tokenRevoke(token, adminToken));
      keystone
        .tokenRevoke(token, adminToken)
        .then((response) => {
          expect(response.status).toEqual(204); // From mock data
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should not cache its results", (done) => {
      const token = 'test_token';

      let mockOptions = mockData.tokenRevoke(token);
      fetchMock.mock(mockOptions);

      keystone
        .tokenRevoke(token)
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(1);

          // Yes, I realize that this should actually return an error since the token is no
          // longer valid, but we're testing for promise caching here, not valid http flow.
          return keystone.tokenRevoke(token);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("tokenInfo()", () => {
    let keystone = null;

    beforeEach(() => {
      fetchMock.mock(mockData.root());
      keystone = new Keystone(mockData.config);
    });

    const token = 'test_token';

    it("should return information about a token", (done) => {
      fetchMock.mock(mockData.tokenInfo(token));
      keystone
        .tokenInfo(token)
        .then((info) => {
          expect(info.token).toBeDefined();
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should not cache its results", (done) => {
      let mockOptions = mockData.tokenInfo(token);
      fetchMock.mock(mockOptions);

      keystone
        .tokenInfo(token)
        .then((info) => {
          expect(info.token).toBeDefined();
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(1);
          return keystone.tokenInfo(token);
        })
        .then((info) => {
          expect(info.token).toBeDefined();
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("catalogList()", () => {
    let keystone = null;

    beforeEach(() => {
      fetchMock.mock(mockData.root());
      keystone = new Keystone(mockData.config);
    });

    it("should return the catalog as an array.", (done) => {
      const token = 'test_token';

      fetchMock.mock(mockData.catalogList(token));
      keystone
        .catalogList(token)
        .then((catalog) => {
          expect(catalog.length).not.toBe(0);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should not cache its results", (done) => {
      const token = 'test_token';

      let mockOptions = mockData.catalogList(token);
      fetchMock.mock(mockOptions);

      keystone
        .catalogList(token)
        .then(() => {
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(1);
          return keystone.catalogList(token);
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });
});
