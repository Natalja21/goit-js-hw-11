import axios from "axios";
axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '25712416-b7f8b21cfce49117d938a95c8';
const PARAM = 'orientation=horizontal&image_type=photo&safesearch=true';

class FetchImagesService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40
  }

  async fetchImages() {
    try {
      const response = await axios.get(`/?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.per_page}&${PARAM}`);
      this.incrementPage();
      return response.data;

    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
  
}

export { FetchImagesService };
