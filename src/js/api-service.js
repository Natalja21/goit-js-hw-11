const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29132832-e4a149fcc4594c93db1ed8e83';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  fecthArtical() {
    const API_PARAMETERS = `q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    return fetch(`${BASE_URL}?key=${API_KEY}&${API_PARAMETERS}`)
      .then(response => response.json())
      .then(({hits}) => {
        this.page += 1;
        return hits;
      });
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
}
