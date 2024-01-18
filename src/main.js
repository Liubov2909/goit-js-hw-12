import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const galleryBox = document.querySelector('.gallery-box');
const loaderTopBtn = document.querySelector('.loader-top');
const loaderBottomBtn = document.querySelector('.loader-bottom');
const input = document.querySelector('input');
const loadImg = document.querySelector('.load-image');
const body = document.querySelector('body');

let page = 1;
let q = '';
let per_page = 40;

const lightbox = new SimpleLightbox('.gallery a', {
  nav: true,
  captionsData: 'alt',
  close: true,
  enableKeyboard: true,
  docClose: true,
});

form.addEventListener('submit', onSubmit);
loadImg.addEventListener('click', loadMore);

async function onSubmit(event) {
  event.preventDefault();
  loaderTopBtn.style.display = 'block';
  loadImg.style.display = 'none';
  page = 1;
  q = event.target.elements.search.value.trim();

  if (!q) {
    gallery.innerHTML = '';
    iziToast.info({
      position: 'topRight',
      message: 'Error enter any symbols',
    });
    loaderTopBtn.style.display = 'none';
    return;
  }

  try {
    const {
      data: { hits, totalHits },
    } = await searchImg(q, page);

    if (hits.length > 0) {
      loaderTopBtn.style.display = 'none';
      gallery.insertAdjacentHTML('beforeend', renderImg(hits));
      lightbox.refresh();
      iziToast.success({
        position: 'topRight',
        message: `We found ${totalHits} photos`,
      });
      loadImg.style.display = 'block';
    } else {
      gallery.innerHTML = '';
      iziToast.error({
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    }

    if (totalHits <= per_page) {
      loadImg.style.display = 'none';
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    loaderTopBtn.style.display = 'none';
    event.target.reset();
  }
}

function searchImg(q, page) {
  axios.defaults.baseURL = 'https://pixabay.com';

  return axios.get('/api/', {
    params: {
      key: '41529899-34462864becb6db8698a10d1b',
      q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
    },
  });
}

function renderImg(hits = []) {
  return hits.reduce((html, hit) => {
    return (
      html +
      `<li class="gallery-item">
        <a href=${hit.largeImageURL}>
          <img class="gallery-img" src=${hit.webformatURL} alt=${hit.tags} />
        </a>
        <div class="gallery-text-box">
          <p>Likes: <span class="text-value">${hit.likes}</span></p>
          <p>views: <span class="text-value">${hit.views}</span></p>
          <p>comments: <span class="text-value">${hit.comments}</span></p>
          <p>downloads: <span class="text-value">${hit.downloads}</span></p>
        </div>
      </li>`
    );
  }, '');
}

async function loadMore(event) {
  loaderBottomBtn.style.display = 'block';
  loadImg.style.display = 'none';
  const listItem = document.querySelector('.gallery-item:first-child');

  if (listItem) {
    const itemHeight = listItem.getBoundingClientRect().height;

    try {
      page += 1;

      const {
        data: { hits, totalHits },
      } = await searchImg(q, page);
      const totalPage = Math.ceil(totalHits / per_page);

      loadImg.style.display = 'block';
      gallery.insertAdjacentHTML('beforeend', renderImg(hits));
      lightbox.refresh();

      if (page === totalPage) {
        loadImg.style.display = 'none';
        return iziToast.info({
          position: 'topRight',
          message: `We're sorry, but you've reached the end of search results.`,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      loaderBottomBtn.style.display = 'none';
      window.scrollBy({
        top: 2 * itemHeight,
        behavior: 'smooth',
      });
    }
  }
}

// Додано прослуховування події прокрутки сторінки
window.addEventListener('scroll', onScroll);
const onScroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
