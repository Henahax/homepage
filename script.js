function home() {
    document.getElementById("contentHome").style.display = "block";
  document.getElementById("contentTools").style.display = "none";
    document.getElementById("contentDiscord").style.display = "none";

    $('a#navhome').addClass('active');
  $('a#navtools').removeClass('active');
    $('a#navdiscord').removeClass('active');

    copyright();
}

function copyright(){
    document.getElementById("copyright").innerHTML = "© " + new Date().getFullYear() + " - Henahax"; 
}