const cardContainerElement = document.querySelector('#card-container');

function getBlogPosts() {
  fetch('https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      renderAllPostItems(data);
    });
}

getBlogPosts();

function renderAllPostItems(posts) {
  posts.forEach((post) => renderEachPostItem(post));
}

function renderEachPostItem(post) {
  const topic = getPostTopic(post);
  const date = formatDate(post?.date);
  const author = post?._embedded?.author[0]?.name;

  const newElement = document.createElement('div');
  newElement.className = 'col-4 p-card--post';

  let htmlToReturn = `
    <header class="p-card__header">
        <h5 class="p-muted-heading u-no-margin--bottom">${topic}</h5>
    </header>
    <div class="p-card__content">
        <div class="u-crop--16-9">
            <a href=${post?.link} aria-hidden="true" tabindex="-1">
                <img src=${post?.featured_media} alt="Blog post" class="p-card__image">
            </a>
        </div>
        <h3 class="p-heading--4">
            <a href=${post?.link}>
                ${post?.title.rendered}
            </a>
        </h3>
        <p>
            <em>
                by
                <a href="/blog/author/canonical">${author}</a>
                on ${date}
            </em>
        </p>
    </div>
    <p class="p-card__footer">Article</p>
  `;

  newElement.innerHTML += htmlToReturn;
  cardContainerElement.append(newElement);
}

// Grab nested topic from post
function getPostTopic(post) {
  let topic;

  if (post?.topic.length > 0) {
    topic = post?._embedded['wp:term'][2][0]?.name;
  } else {
    topic = post?._embedded['wp:term'][1][0]?.name;
  }

  return topic;
}

// format date from ISOstring
function formatDate(date) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const postDate = new Date(date);

  const formattedDate = `${postDate.getDay()} ${
    monthNames[postDate.getMonth() + 1]
  } ${postDate.getFullYear()}`;

  return formattedDate;
}
