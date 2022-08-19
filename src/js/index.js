import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import 'modern-normalize/modern-normalize.css';
import { FetchImagesService } from './api-service';
import { refs } from './getRefs';
import { LoadMoreBtn } from './load-more-btn';
import { makeImageMarkup } from './markupService';

const fetchImagesService = new FetchImagesService();
const loadMoreBtn = new LoadMoreBtn({ selektor: '.load-more', hidden: true });
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});


// Очистка галереи
function clearImageContainer() {
  refs.gallery.innerHTML = '';
}

// разметка галереи
function appendImagesMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', makeImageMarkup(data));
}

//  кнопка поиска картинки
async function onButtonSearchImagesClick(e) {
  e.preventDefault();
  loadMoreBtn.hide();
  clearImageContainer();
  fetchImagesService.resetPage()
  fetchImagesService.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (!fetchImagesService.searchQuery) {
    return Notify.info(`Enter a word to search for images.`);
  }
  try {
    const { totalHits, hits } = await fetchImagesService.fetchImages()
    if (hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    if (hits.length !== 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`)
      appendImagesMarkup(hits);
      lightbox.refresh();
      loadMoreBtn.show();
    }
  }
  catch (error) {
    console.log(error.message)
    console.log(fetchImagesService.fetchImages())
  }
}

// кнопка посмотреть больше
async function onButtonLoadMoreClick() {
  loadMoreBtn.disabled(); 
  try {
    const { totalHits, hits } = await fetchImagesService.fetchImages()
    fetchImagesService.incrementPage
    appendImagesMarkup(hits);
    onPageScrolling();
    lightbox.refresh();
    if ( Math.ceil(fetchImagesService.page * fetchImagesService.per_page) > totalHits ) {
      Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      loadMoreBtn.hide();     
    }
    loadMoreBtn.enable();       
   }
  catch (error) {
    console.log(error.message)
  }
};

//  Плавная прокрутка страницы после запроса и отрисовки каждой следующей группы изображений
function onPageScrolling() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2 ,
    behavior: 'smooth',
  });
}

//  слушатели 
refs.formSearch.addEventListener('submit', onButtonSearchImagesClick);
loadMoreBtn.refs.button.addEventListener('click', onButtonLoadMoreClick);