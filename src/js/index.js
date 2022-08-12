import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import 'modern-normalize/modern-normalize.css';
import PixabayApiServise from './api-service';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.search-form button')
};


let searchQuery = '';
let perPage = 0;
const newPixabayApiServise = new PixabayApiServise();

const onSearch = e => {
  e.preventDefault();
  newPixabayApiServise.searchQuery = e.currentTarget.elements.searchQuery.value;
  if (newPixabayApiServise.searchQuery) {
    newPixabayApiServise.resetPage();
    appendPictureMarkup()
    perPage = 0;
    clearPictureContainer();
    
  }
  if (!newPixabayApiServise.searchQuery) {
    Notify.failure(
      `Please, enter search criteria.`

    );
    clearPictureContainer()
  }
};
refs.searchForm.addEventListener('submit', onSearch);

// const onLoadMore = () => {
//     // newApiService.fecthArtical(searchQuery).then(hits => createSimplelightboxGallery(hits));
// };
// refs.loadMoreBtn.addEventListener('click', onLoadMore);


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


// const refs = getRefs();
// const pixabayApiServise = new PixabayApiServise();
// let perPage = 0;

// refs.searchForm.addEventListener('submit', onSearch);

// function onSearch(e) {
//   e.preventDefault();
//   pixabayApiServise.query = e.currentTarget.elements.searchQuery.value;
//   pixabayApiServise.resetPage();
//   perPage = 0;
//   appendPictureMarkup();
//   clearPictureContainer();
// }

// function getRefs() {
//   return {
//     searchForm: document.querySelector('#search-form'),
//     pictureContainer: document.querySelector('.gallery'),
//   };
// }

function clearPictureContainer() {
  refs.gallery.innerHTML = '';
}

function notifyMessage(hits, totalHits, perPage) {
  if (hits.length !== 0 && perPage === newPixabayApiServise.per_page) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (perPage > totalHits) {
    Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
 
}



async function appendPictureMarkup() {
  try {
    const responce = await newPixabayApiServise.fetchPicture();
    const {
      data: { hits, totalHits },
    } = responce;
    createSimplelightboxGallery(hits)
    perPageCounter();
    notifyMessage(hits, totalHits, perPage);
  } catch (error) {
    console.log(error.message);
  }
}

function perPageCounter() {
  perPage += newPixabayApiServise.per_page;
}

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    appendPictureMarkup();
  }
});