const URL_BASE = 'https://api.github.com/search/repositories';
const PER_PAGE = 10;

const form = document.querySelector('.form');
const repoTemplate = document.querySelector('#repository').content.querySelector('.repository__item');
const reposListElement = document.querySelector('.repository-list');
const reposListFragment = document.createDocumentFragment();
const searchInput = document.querySelector('.search');
const errorContainer = document.querySelector('.error-message');

const getData = (url, onSuccess) => {
  console.log(url);
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      onSuccess(data);
    })
};

const formSubmitHandler = (evt) => {
  evt.preventDefault();
  errorContainer.innerHTML = '';

  if (searchInput.value.length > 2) {
    const url = getQuery(searchInput.value);
    // С сервера приходит объект у которого в свойстве "items" - массив данных для отрисовки
    getData(url, (data) => {
      renderRepos(data.items);
    });
  } else {
    displayErrorMessage('Слишком короткий запрос!');
  }
};

const getQuery = (search) => {
  return `${URL_BASE}?q=${search}&per_page=${PER_PAGE}`;
};

const renderRepos = (repos) => {
  reposListElement.innerHTML = '';

  if (repos.length === 0) {
    const header = document.createElement('h2');
    header.textContent = 'Ничего не найдено';
    reposListElement.replaceWith(header);
  } else {
    for (let repo of repos) {
    const repoElement = repoTemplate.cloneNode(true);
    repoElement.querySelector('.repository__name').textContent = repo.name;
    repoElement.querySelector('.repository__language').textContent = repo.language;
    repoElement.querySelector('.repository__updated').textContent = new Date(repo.updated_at).toLocaleDateString('ru-RU');
    repoElement.querySelector('.repository__link').href = repo.html_url;
    reposListFragment.append(repoElement);
  }
    reposListElement.append(reposListFragment);
  }
};

const removeErrorMessage = () => {
  errorContainer.innerHTML = '';
};

const displayErrorMessage = (message) => {
  errorContainer.textContent = message;
  setTimeout(() => {
    errorContainer.innerHTML = '';
  }, 2000);
};

form.addEventListener('submit', formSubmitHandler);
