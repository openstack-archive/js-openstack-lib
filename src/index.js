import 'babel-polyfill';
import 'isomorphic-fetch';
import log from 'loglevel';

log.setLevel('INFO');

export default class Test {
  getUrl (url) {
    return fetch(url)
      .then((response) => {
        return response;
      });
  }
}
