function home() {
    document.getElementById("contentHome").style.display = "block";
//  document.getElementById("contentTools").style.display = "none";
    document.getElementById("contentDiscord").style.display = "none";

    $('a#navhome').addClass('active');
//  $('a#navtools').removeClass('active');
    $('a#navdiscord').removeClass('active');

    copyright();
}

/*
function tools(){
    document.getElementById("contentHome").style.display = "none";
    document.getElementById("contentTools").style.display = "block";
    document.getElementById("contentDiscord").style.display = "none";

    $('a#navhome').removeClass('active');
    $('a#navtools').addClass('active');
    $('a#navdiscord').removeClass('active');

    copyright();
    values();
}
*/

function discord(){
    document.getElementById("contentHome").style.display = "none";
//  document.getElementById("contentTools").style.display = "none";
    document.getElementById("contentDiscord").style.display = "block";

    $('a#navhome').removeClass('active');
//  $('a#navtools').removeClass('active');
    $('a#navdiscord').addClass('active');

    copyright();
}

function copyright(){
    document.getElementById("copyright").innerHTML = "© " + new Date().getFullYear() + " - Henahax"; 
}

/*
function values(){
    var ectoBuy = 0;
    var dustSell = 0;
    $.getJSON('https://api.guildwars2.com/v2/commerce/prices?ids=19721,24277', function (data) {
        $.each(data, function (index, element) {
            if (element.id == 19721) {
                ectoBuy = element.buys.unit_price;
            }
            if (element.id == 24277) {
                dustSell = element.sells.unit_price;
            }
        });
        var profit = 0;
        profit = Math.round(((1.85 * dustSell) / 1.15) - (ectoBuy + 50));

        document.getElementById("ectoBuy").innerHTML = ectoBuy + " " + "<img src='https://wiki.guildwars2.com/images/e/eb/Copper_coin.png'>";
        document.getElementById("dustSell").innerHTML = dustSell + " " + "<img src='https://wiki.guildwars2.com/images/e/eb/Copper_coin.png'>";
        document.getElementById("profit").innerHTML = profit + " " + "<img src='https://wiki.guildwars2.com/images/e/eb/Copper_coin.png'>";
    });
}
*/