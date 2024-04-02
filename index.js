//might just do everything in here lol
//next issue, need to pass in playlist info to be able to look at songs

//MAINPAGE AND ADDPLAY HTML FILES
const playlists = new Map();
function login() 
{
  const userpass= document.querySelectorAll("#text-box"); 
  localStorage.setItem("userName", userpass[0]); 
  localStorage.setItem("password", userpass[1]);
    /*
    maybe need to change, make it so that it stores the info so you can have a correct/incorrect login?
    */ 
  window.location.href = "mainpage.html";
}
function addToList() 
{
  var myList = document.getElementById('playlistNames');
  var playlistTitles = JSON.parse(localStorage.getItem("PlaylistTitles")) || [];
  
  playlistTitles.forEach(function(title) {
    var listItem = document.createElement('li');
    var titleNode = document.createTextNode(title);
    listItem.appendChild(titleNode);
    createPlaylist(titleNode);
    myList.appendChild(listItem.cloneNode(true));
  });
  //listItem.appendChild(document.createTextNode(localStorage.getItem("PlaylistTitle")));
  //myList.appendChild(listItem);
}
function getTitle() //changes the visual list part
{
  const value = document.getElementById('playlistTitle').value;
  var playlistTitles = JSON.parse(localStorage.getItem("PlaylistTitles")) || [];
  playlistTitles.push(value);
  localStorage.setItem("PlaylistTitles", JSON.stringify(playlistTitles));
  window.location.href = "mainpage.html";
}
function createPlaylist(value) 
{
  playlists.set(value, []);
}

function addSong(playlistName, song) 
{
  playlists.get(value).push(song);
}

// PLAYLIST.HTML: Need to make the list and header change depending on what is clicked
function getQueryParam(param) 
{
  const urlParams = new URLSearchParams(window.location.search);
  const newHead = urlParams.get(param);
  if (newHead) {
    document.getElementById('header').textContent = newHead;
  }

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


