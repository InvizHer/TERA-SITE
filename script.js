document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        fetch(`/search?query=${query}`)
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(movie => {
                        const movieDiv = document.createElement('div');
                        movieDiv.innerHTML = `<p>${movie.name} - <a href="${movie.link}" download>Download</a></p>`;
                        resultsDiv.appendChild(movieDiv);
                    });
                } else {
                    resultsDiv.innerHTML = '<p>No results found</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = '<p>Error fetching movies. Please try again later.</p>';
            });
    }
});
