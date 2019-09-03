import axios from 'axios';

export class MarvelService {

  // --------------------------------------------------
  // ENDPOINTS
  // --------------------------------------------------
  static get ENDPOINTS() {
    return {
      comic: 'https://gateway.marvel.com:443/v1/public/comics',
      comics: 'https://gateway.marvel.com:443/v1/public/comics',
      character: 'https://gateway.marvel.com:443/v1/public/characters',
      characters: 'https://gateway.marvel.com:443/v1/public/characters',
    };
  }

  // --------------------------------------------------
  // SETUP
  // --------------------------------------------------
  constructor(config) {
    this.apiKey = config.apiKey;
  }

  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------
  getAuthConfig() {
    return { apikey: this.apiKey };
  }

  // --------------------------------------------------
  // CHARACTERS-RELATED METHODS
  // --------------------------------------------------
  getCharacters(config = {}) {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet.');
    console.log('__LOGGING OUT CONFIG', config);
    // TODO:
    // - Create the `params` object.
    const myRequestParams = { apikey: this.apiKey, ...config, };
    console.log('__LOGGING OUT myRequestParams', myRequestParams);
    // - Extract the correct endpoint from `ENDPOINTS`.
    const endpoint = MarvelService.ENDPOINTS.characters;
    console.log('__LOGGING OUT ENDPOINT', endpoint);
    // - Dispatch a request using `axios.get()`.
    console.log('__MAKING A REQUEST');
    return axios.get(endpoint, { params: myRequestParams })
      .then((response) => {
        console.log('__RECIEVED RESPONSE DATA');
        console.log(response);
        return response.data;
      });
    // - Parse and return the response.
  }

  getCharacter(id, config = {}) {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet.');
    // TODO:
    // - Create the `params` object.
    const myRequestParams = { ...this.getAuthConfig(), ...config, };
    // - Extract the correct endpoint from `ENDPOINTS`; add the `id`.
    const endpoint = MarvelService.ENDPOINTS.character + '/' + id;
    // - Dispatch a request using `axios.get()`.
    return axios.get(endpoint, { params: myRequestParams })
      .then((response) => {
        console.log(response);
        return response.data.data;
      });
    // - Parse and return the response.
  }
}
