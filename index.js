//might just do everything in here lol
//next issue, need to pass in playlist info to be able to look at songs

//MAINPAGE AND ADDPLAY HTML FILES
var playlists = new Map();

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
function setPlaylistMap() 
{
  var storedPlaylists = localStorage.getItem("playlists");
  if (storedPlaylists) {
    playlists = new Map(JSON.parse(storedPlaylists));
  } else {
    playlists = new Map();
  }
}
function addToList() 
{
  setPlaylistMap();
  var myList = document.getElementById('playlistNames');
  var playlistTitles = JSON.parse(localStorage.getItem("PlaylistTitles")) || [];
  
  playlistTitles.forEach(function(title) {
    var listItem = document.createElement('li');
    var titleNode = document.createTextNode(title);
    listItem.appendChild(titleNode);
    createPlaylist(titleNode);
    setPlaylistMap();
    myList.appendChild(listItem.cloneNode(true));
  });
}
function createPlaylist(value) 
{
  if (!playlists.get(value)) {
    playlists.set(value, []);
  }
  localStorage.setItem("playlists", JSON.stringify(Array.from(playlists.entries())));
}
function getTitle() //changes the visual list part
{
  setPlaylistMap();
  const value = document.getElementById('playlistTitle').value;
  var playlistTitles = JSON.parse(localStorage.getItem("PlaylistTitles")) || [];
  playlistTitles.push(value);
  createPlaylist(value);
  localStorage.setItem("PlaylistTitles", JSON.stringify(playlistTitles));
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

function getVotes() 
{
  var storedPlaylists = localStorage.getItem("playlists");
  if (storedPlaylists) {
    playlists = new Map(JSON.parse(storedPlaylists));
  } else {
    playlists = new Map();
  }
  var votingResults = document.getElementsByName('varRadio');
  selectedValue = "";
  noVotes = [];
  yesVotes = [];
  for (var i = 0; i < votingResults.length; i++) {
    // Check if the radio button is checked
    if (votingResults[i].checked) {
      selectedValue = votingResults[i].value;
      if (selectedValue === 'No') {
        noVotes.push(1);
      }
      else {
        yesVotes.push(1);
      }
    }
  }
  var playName = localStorage.getItem("playlistAdded");
  var song = localStorage.getItem("PotentialSong");
  if (yesVotes.length >= noVotes.length) 
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
