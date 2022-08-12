
import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29132832-e4a149fcc4594c93db1ed8e83';


export default class PixabayApiServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchPicture() {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    });

    const url = `${BASE_URL}?${searchParams}`;
    this.incrementPage();
    return await axios.get(url);
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get per_Page() {
    return this.per_page;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}