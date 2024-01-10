import { renderImages } from './html-render';
import { createMessage } from './library-izi';

const searchOptionsOb = {
  key: '41529899-34462864becb6db8698a10d1b',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

const buttonEl = document.querySelector('.search-btn');
const loadingTextEl = document.querySelector('.loading-message');

export function downloadImages(searchKey) {
  loadingTextEl.style.display = 'block';
  buttonEl.disabled = true;
  buttonEl.blur();
  
  fetchImages(searchKey)
    .then(images => renderImages(images))
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      loadingTextEl.style.display = 'none';
      buttonEl.disabled = false;
    });
}

function fetchImages(searchText) {
  searchOptionsOb.q = searchText;
  const searchOptions = new URLSearchParams(searchOptionsOb);

  return fetch(`https://pixabay.com/api/?${searchOptions.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => createMessage(error));
}