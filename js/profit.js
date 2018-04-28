function values(){
    var ectoEinkauf = 0;
    var staubVerkauf = 0;
    $.getJSON('https://api.guildwars2.com/v2/commerce/prices?ids=19721,24277', function (data) {
        $.each(data, function (index, element) {
            if (element.id == 19721) {
                ectoEinkauf = element.buys.unit_price;
            }
            if (element.id == 24277) {
                staubVerkauf = element.sells.unit_price;
            }
        });
        var profit = 0;
        profit = Math.round(((1.85 * staubVerkauf) / 1.15) - (ectoEinkauf + 50));

        document.getElementById("ectoBuy").innerHTML = ectoEinkauf + "<img src='https://wiki.guildwars2.com/images/e/eb/Copper_coin.png'>";
        document.getElementById("dustSell").innerHTML = staubVerkauf + "<img src='https://wiki.guildwars2.com/images/e/eb/Copper_coin.png'>";
        document.getElementById("profit").innerHTML = profit + "<img src='https://wiki.guildwars2.com/images/e/eb/Copper_coin.png'>";
    });

}