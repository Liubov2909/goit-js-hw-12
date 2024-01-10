import { createMessage } from './js/library-izi';
import { downloadImages } from './js/request';

const formEl = document.querySelector('.search-form');

document.querySelector('.loading-message').style.display = 'none';

formEl.addEventListener('submit', event => {
  event.preventDefault();

  let searchKey = formEl.elements.search.value.trim();
  if (!searchKey) {
    createMessage('Search must be filled!');
    return;
  }
  formEl.reset();

  downloadImages(searchKey);
});