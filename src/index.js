import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import log from 'loglevel';

log.setLevel('INFO');

export default class Test {
  getUrl(url) {
    return fetch(url)
      .then((response) => {
        log.info(response.status);
        return response;
      });
  }
}
