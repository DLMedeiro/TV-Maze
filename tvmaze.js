


/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: res.data.show.id
        name: res.data.show.name
        summary: res.data.show.summary
        image: res.data.show.image.original *if statement if null and replacement image
      }
 */


async function searchShows(query) {

  const res = await axios.get("https://api.tvmaze.com/search/shows", {params: {q:query}});

  console.log(res)
    let results = res.data.map(result => {
    let shows = result.show
      return {
        id: shows.id,
        name: shows.name,
        summary: shows.summary,
        image: shows.image ? shows.image.original : "/Image/pexels-pixabay-262488.jpg",
      }
    });
    return results;
    // results = Array of objects including id, name, summary
    // map creates a new array (results) 
    // ? result = placeholder for each index within the res.data array
    // => loops over each result (index item) and returns an object
};

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id='episodeBtn' data-show-id="${show.id}">Show Epsiode List</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);

  let episodeResults = res.data.map(result => {
  let episode = result;
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    }
  });
    return episodeResults;
}

function populateEpisodes(episodes) {
  const $episodeList = $("#episodes-list");
  for (let episode of episodes) {
    let $item = $(
      `<li>
      Episode Name : ${episode.name} | Season ${episode.season} - Episode ${episode.number}
      </li>
      `);
    $episodeList.append($item);
    $("#episodes-area").show();

  }
}

const showsList = document.getElementById('shows-list')

showsList.addEventListener('click', async function(e){
  e.preventDefault();
  let selectedID = e.target.getAttribute('data-show-id');

  let episodeList = await getEpisodes(selectedID);
  populateEpisodes(episodeList);
  console.log(episodeList)
})

