import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import 'modern-normalize/modern-normalize.css';
import ApiService from './api-service';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let searchQuery = '';
let page = 1;
const newApiService = new ApiService();

const onSearch = e => {
    e.preventDefault();
    
  newApiService.query = e.currentTarget.elements.searchQuery.value;
  newApiService.resetPage();
    newApiService.fecthArtical(searchQuery).then(hits => createSimplelightboxGallery(hits));
};
refs.searchForm.addEventListener('submit', onSearch);

const onLoadMore = () => {
    newApiService.fecthArtical(searchQuery).then(hits => createSimplelightboxGallery(hits));
};
refs.loadMoreBtn.addEventListener('click', onLoadMore);


//  Розмітка галереї
const createListCard = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => {
  return `<a class="gallery-item" href="${largeImageURL}">
            <div class="photo-card">
                <img class = "card-image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
                <div class="info">
                    <p class="info-item">
                        <b>likes:</b> 
                        ${likes}
                    </p>
                    <p class="info-item">
                        <b>views:</b> 
                        ${views}
                    </p>
                    <p class="info-item">
                        <b>comments:</b>
                        ${comments}
                    </p>
                    <p class="info-item">
                        <b>downloads:</b>
                        ${downloads}
                    </p>
                </div>
            </div>
        </a>`;
};
const generateCards = cards =>
  cards.reduce((acc, card) => acc + createListCard(card), '');

const createSimplelightboxGallery = data => {
  const result = generateCards(data);
  refs.gallery.innerHTML = result;
  let gallery = new SimpleLightbox('.gallery a').refresh();
};


