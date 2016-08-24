import 'babel-polyfill';
import 'isomorphic-fetch';

export default class Test {
  getUrl (url) {
    return fetch(url)
      .then((response) => {
        return response;
      });
  }
}
