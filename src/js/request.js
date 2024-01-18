import { renderImages } from './html-render';
import { createMessage } from './library-izi';
import axios from 'axios';

const searchOptionsOb = {
  key: '41529899-34462864becb6db8698a10d1b',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};

const searchBtn = document.querySelector('.search-btn');
const loadMoreBtn = document.querySelector('.load-more-btn');
const searchLoadingTextEl = document.querySelector('.main-load');
const moreLoadingTextEl = document.querySelector('.more-load');

export async function downloadImages(searchKey, isLoadMore = false) {
  if (isLoadMore) {
    moreLoadingTextEl.style.display = 'block';
    loadMoreBtn.style.display = 'none';
    loadMoreBtn.blur();

    if (searchOptionsOb.page === 1) searchOptionsOb.page++;
  } else {
    searchLoadingTextEl.style.display = 'block';
    searchBtn.disabled = true;
    searchBtn.blur();

    searchOptionsOb.page = 1;
  }

  searchOptionsOb.q = searchKey;
  let isDownloarError = false;
  let totalHits = 0;
  try {
    const images = await fetchImages();
    totalHits = images.totalHits;
    renderImages(images, isLoadMore);
  } catch (error) {
    createMessage(error);
    isDownloarError = true;
  }

  if (isLoadMore) {
    if (!isDownloarError) {
      searchOptionsOb.page++;

      const elementRect = document
        .querySelector('.gallery-link')
        .getBoundingClientRect();
      window.scrollBy({
        top: elementRect.height * 2.0,
        left: 0,
        behavior: 'smooth',
      });

      if (searchOptionsOb.per_page * searchOptionsOb.page >= totalHits)
        createMessage(
          "We're sorry, but you've reached the end of search results."
        );
      else loadMoreBtn.style.display = 'flex';
    } else loadMoreBtn.style.display = 'flex';

    moreLoadingTextEl.style.display = 'none';
  } else {
    searchLoadingTextEl.style.display = 'none';
    searchBtn.disabled = false;
    loadMoreBtn.style.display = 'flex';
  }
}

async function fetchImages() {
  const response = await axios.get('https://pixabay.com/api/', {
    params: { ...searchOptionsOb },
  });

  return response.data;
}