//might just do everything in here lol
//next issue, need to pass in playlist info to be able to look at songs
//SERVICE PART?
//MAINPAGE AND ADDPLAY HTML FILES
var playlists = new Map();
async function loginUser() {
  loginOrCreate(`/api/auth/login`);
}

async function createUser() {
  loginOrCreate(`/api/auth/create`);
}
async function loginOrCreate(endpoint) {
  const userName = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const response = await fetch(endpoint, {
    method: 'post',
    body: JSON.stringify({ email: userName, password: password }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  //issue with creating new account specifically
  if (response.ok) {
    localStorage.setItem('userName', userName);
    window.location.href = 'mainpage.html';
  } else {
    const body = await response.json();
    const modalEl = document.querySelector('#msgModal');
    modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
    const msgModal = new bootstrap.Modal(modalEl, {});
    msgModal.show();
  }
}
async function getUser(email) {
  let scores = [];
  // See if we have a user with the given email.
  const response = await fetch(`/api/user/${email}`);
  if (response.status === 200) {
    return response.json();
  }

  return null;
}
//not sure if using logout
function logout() {
  localStorage.removeItem('userName');
  fetch(`/api/auth/logout`, {
    method: 'delete',
  }).then(() => (window.location.href = '/'));
}

//maybe get rid of this function :)
async function setPlaylistMap() 
{
  try 
  {
    const email = localStorage.getItem('userName');
    const response = await fetch(`/api/playlist?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    });
    if (response.ok) {
      const playlists = await response.json();
      //maybe don't do the map anymore teehee
      const playlistMap = new Map(playlists.map(playlist => [playlist.title, playlist.songs]));
      //localStorage.setItem("playlists", JSON.stringify(Array.from(playlistMap.entries())));
    } 
    else {
      console.log(":(")
    }
  } catch (error) {
    console.error('Error retrieving playlists:', error);
  }
  /*var storedPlaylists = localStorage.getItem("playlists");
  if (storedPlaylists) {
    playlists = new Map(JSON.parse(storedPlaylists));
  } else {
    playlists = new Map();
  }*/
}
async function addToList() 
{
  console.log("in add to list");
  const email = localStorage.getItem('userName');
  const response = await fetch(`/api/playlist?email=${email}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8'
      }
  });
  if (response.ok) {
    const play = await response.json();
    console.log(play);
    var myList = document.getElementById('playlistNames');

    //can I do this on this? idk
    play.forEach(playlist => {
      var listItem = document.createElement('li');
      console.log(playlist.title);
      listItem.textContent = playlist.title;
      myList.appendChild(listItem);
    });
  }
  else {
    console.log(":(");
  }
  
  
  /*playlistTitles.forEach(function(title) {
    var listItem = document.createElement('li');
    var titleNode = document.createTextNode(title);
    listItem.appendChild(titleNode);
    //setPlaylistmap()
    myList.appendChild(listItem.cloneNode(true));
    createPlaylist(titleNode); //this may not be necessary anymore
  });*/
}
async function createPlaylist(value) 
{
  //await setPlaylistMap(); // Make sure to await the async function
  const playlist = await DB.getPlaylists(localStorage.getItem("userName")); //gets all the playlists in the thing
  const playlistExists = playlists.some(playlist => playlist.title === value);
  if (!playlistExists) {
      //playlists.set(value, []); // Update local Map

      try {
        // Add playlist to database
        const playlistData = { title: value, songs: [] };
        await DB.addPlay(playlistData, localStorage.getItem("userName"));
      } catch (error) {
          console.error('Error adding playlist to database:', error);
      }

      //localStorage.setItem("playlists", JSON.stringify(Array.from(playlists.entries())));
  }
  /*if (!playlists.get(value)) {
    playlists.set(value, []);
  }
  localStorage.setItem("playlists", JSON.stringify(Array.from(playlists.entries())));*/
}
function getTitle()
{
  //setPlaylistMap();
  const value = document.getElementById('playlistTitle').value;
  console.log(value);
  //var playlistTitles = JSON.parse(localStorage.getItem("PlaylistTitles")) || [];
  //playlistTitles.push(value);
  createPlaylist(value); //change this so it adds to the database, then isn't necessary
  //localStorage.setItem("PlaylistTitles", JSON.stringify(playlistTitles));
  window.location.href = "mainpage.html";
}

// PLAYLIST.HTML: Need to make the list and header change depending on what is clicked
function getQueryParam(param) 
{
  setPlaylistMap();
  const urlParams = new URLSearchParams(window.location.search);
  var newHead = urlParams.get(param);
  if (newHead) {
    document.getElementById('header').textContent = newHead;
  }
  console.log(newHead);
  var songs = playlists.get(newHead);
  var myList = document.getElementById('songNames');
  songs.forEach(function(title) {
    var listItem = document.createElement('li');
    var titleNode = document.createTextNode(title);
    listItem.appendChild(titleNode);
    myList.appendChild(listItem.cloneNode(true));
  });
  //next set list items to be the items in the map
}

//ADDSONG.HTML
/*
need to make it so search feature works that should be done using services, at least takes text and moves
to the next page

then we need the playlist options to be from the playlists already made

then move to voting should pass in the info from the search service

*/

function fillPlaylists() 
{
  setPlaylistMap();
  var myPlaylistOptions = document.getElementById('select');
  var playlistTitles = JSON.parse(localStorage.getItem("PlaylistTitles")) || [];
  //for each create a new option?
  playlistTitles.forEach(function(title) 
  {
    var optionItem = document.createElement('option');
    var titleNode = document.createTextNode(title);
    optionItem.appendChild(titleNode);
    myPlaylistOptions.appendChild(optionItem.cloneNode(true));
  });
}

//hopefully works 
function getSongSearch() 
{
  setPlaylistMap();
  var getSong = document.getElementById('search').value;
  var playListName = document.getElementById('select').value; //hopefully right
  localStorage.setItem("PotentialSong", JSON.stringify(getSong));
  localStorage.setItem("playlistAdded", playListName);
  window.location.href = "voting.html";
}

//VOTING.HTML

function fillVoting() 
{
  document.getElementById("question").innerHTML = "Should the song " + localStorage.getItem("PotentialSong") + " be added to the playlist " + localStorage.getItem("playlistAdded") + "?";
}
async function addVotes() 
{
  try {
    var votingResults = document.querySelector('input[name="varRadio"]:checked').value;
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({ vote: votingResults })
    });
    const data = await response.json(); //problem, data not sending properly

    console.log(data); // Log response from server (e.g., success message)
    await displayVotes(); // Update voting results display after submitting vote
  }
  catch (error) {
    console.error('Error submitting vote:', error);
  }
}
async function displayVotes() 
{
  try {
    // Get the latest high scores from the service

    const response = await fetch('/api/votes');
    const { yesVotes, noVotes } = await response.json(); 
    //document.getElementById("question").innerHTML = "Should the song " + yesVotes + " be added to the playlist " + noVotes + "?";

    localStorage.setItem('yesVotes', JSON.stringify(yesVotes));
    localStorage.setItem('noVotes', JSON.stringify(noVotes));
    getVotes(yesVotes, noVotes);
  } catch (error){
    console.error('Error fetching and storing voting results:', error);
    // If there was an error then just use the last saved scores
    const votesText = localStorage.getItem('yesVotes');
    const noText = localStorage.getItem('noItem');
    if (votesText && noText) {
      yesVotes = JSON.parse(votesText);
      noVotes = JSON.parse(noText);
    }
    getVotes(yesVotes, noVotes);
  }

}
function getVotes(yesVotes, noVotes) 
{
  var storedPlaylists = localStorage.getItem("playlists");
  if (storedPlaylists) {
    playlists = new Map(JSON.parse(storedPlaylists));
  } else {
    playlists = new Map();
  }
  
  const playName = localStorage.getItem("playlistAdded");
  const song = localStorage.getItem("PotentialSong");
  //document.getElementById("question").innerHTML = "Should the song " + yesVotes + " be added to the playlist " + noVotes + "?";
  if (yesVotes > noVotes) 
  {
    var myList = playlists.get(playName) || [];
    myList.push(song);
    playlists.set(playName, myList);
    localStorage.setItem("playlists", JSON.stringify(Array.from(playlists.entries())));
  }
  window.location.href = "mainpage.html";
}



//FRIEND REQUESTS

function loadFriends() {
  var friends = JSON.parse(localStorage.getItem("friendList")) || [];

  friends.forEach(function (friendName) {
    var listItem = document.createElement('li');
    var titleNode = document.createTextNode(friendName);
    listItem.appendChild(titleNode);
    document.getElementById("friends").appendChild(listItem);
  });
}
function friend() 
{
  var getUser = document.getElementById('Username').value;

  var listItem = document.createElement('li');
  var titleNode = document.createTextNode(getUser);
  listItem.appendChild(titleNode);

  document.getElementById('friends').appendChild(listItem);
  document.getElementById('Username').value = '';

  var friends = JSON.parse(localStorage.getItem("friendList")) || [];
  if (!Array.isArray(friends)) {
    friends = [];
  }
  friends.push(getUser); // Add the new friend to the list
  localStorage.setItem("friendList", JSON.stringify(friends));

}
