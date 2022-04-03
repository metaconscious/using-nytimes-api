function nYTimesArticleSearchAPI(key) {
    // Defining a baseURL and key to as part of the request URL

    const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

    // Grab references to all the DOM elements you'll need to manipulate
    const searchTerm = document.querySelector('.search');
    const startDate = document.querySelector('.start-date');
    const endDate = document.querySelector('.end-date');
    const searchForm = document.querySelector('form');
    const nextBtn = document.querySelector('.next');
    const previousBtn = document.querySelector('.prev');
    const section = document.querySelector('section');
    const nav = document.querySelector('nav');

    // Hide the "Previous"/"Next" navigation to begin with, as we don't need it immediately
    nav.style.display = 'none';

    // define the initial page number and status of the navigation being displayed
    let pageNumber = 0;

    // Event listeners to control the functionality
    function displayResult(json) {
        while (section.firstChild) {
            section.removeChild(section.firstChild);
        }

        const articles = json.response.docs;

        if (articles.length === 10) {
            nav.style.display = 'block';
        } else {
            nav.style.display = 'none';
        }

        if (articles.length === 0) {
            const para = document.createElement('p');
            para.textContent = 'No result returned.';
            section.appendChild(para);
        } else {
            for (const current of articles) {
                const article = document.createElement('article');
                const heading = document.createElement('h2');
                const link = document.createElement('a');
                const img = document.createElement('img');
                const paragraph = document.createElement('p');
                const keywordParagraph = document.createElement('p');
                keywordParagraph.classList.add('keywords');

                console.log(current);

                link.href = current.web_url;
                link.textContent = current.headline.main;
                paragraph.textContent = current.snippet;
                keywordParagraph.textContent = 'Keywords: ';
                for (const keyword of current.keywords) {
                    const span = document.createElement('span');
                    span.textContent = `${keyword.value}`;
                    keywordParagraph.appendChild(span);
                }

                if (current.multimedia.length > 0) {
                    img.src = `https://www.nytimes.com/${current.multimedia[0].url}`;
                    img.alt = current.headline.main;
                }

                heading.appendChild(link);
                article.append(heading, img, paragraph, keywordParagraph);
                section.appendChild(article);
            }
        }
    }

    function fetchResults(e) {
        e.preventDefault();

        let url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}&fq=document_type:("article")`;

        if (startDate.value !== '') {
            url = `${url}&begin_date=${startDate.value}`;
        }

        if (endDate.value !== '') {
            url = `${url}&end_date=${endDate.value}`;
        }

        // Use fetch() to make the request to the API
        fetch(url)
            .then(response => response.json())
            .then(json => displayResult(json))
            .catch(error => console.error(error.message));
    }

    function submitSearch(e) {
        pageNumber = 0;
        fetchResults(e);
    }

    searchForm.addEventListener('submit', submitSearch);

    function nextPage(e) {
        ++pageNumber;
        fetchResults(e);
    }

    nextBtn.addEventListener('click', nextPage);

    function previousPage(e) {
        if (pageNumber > 0) {
            --pageNumber;
        } else {
            return;
        }
        fetchResults(e);
    }

    previousBtn.addEventListener('click', previousPage);


}

fetch('keys/nytimes-api-key').then(request => {
    if (!request.ok) {
        throw new Error(`HTTP Request Error: ${request.status}`);
    }
    return request.text();
}).then(text => {
    nYTimesArticleSearchAPI(text);
}).catch(error => {
    console.error(error);
});