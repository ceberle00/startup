//might just do everything in here lol

const playlists = new Map();
const playNames = [];
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
