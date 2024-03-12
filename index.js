function login() {
    const userpass= document.querySelectorAll("#text-box"); 
    localStorage.setItem("userName", userpass[0]); 
    localStorage.setItem("password", userpass[1]);
    /*
    maybe need to change, make it so that it stores the info so you can have a correct/incorrect login?
    */ 
    window.location.href = "mainpage.html";
  }