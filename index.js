//might just do everything in here lol

const playlists = new Map()

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
function addToList(value) //changes the visual list part
{
  //think this should be good, for the actual playlists we'll make a map
  const listItem = document.createElement('li');
  listItem.textContent = value;
  const myList = document.getElementById('playlistNames');
  myList.appendChild(listItem);
  createPlaylist(value);
}
function createPlaylist(value) 
{
  playlists.set(value, []);
}

function addSong(playlistName, song) 
{
  playlists.get(value).push(song);
}
