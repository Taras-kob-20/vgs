(function() {
    var sendButton = document.getElementById("send");
    var cardNumber = document.getElementById("card_num");
    var cardDate   = document.getElementById("card_date");
    var cardCvv    = document.getElementById("card_cvv");

    var revealButton  = document.getElementById("reveal");
    var secCardNumber = document.getElementById("sec_card_num");
    var secCardDate   = document.getElementById("sec_card_date");
    var secCardCvv    = document.getElementById("sec_card_cvv");

    var sendFunction = function() {
        var data = {
            cardNumber: cardNumber.value,
            cardDate  : cardDate.value,
            cardCvv   : cardCvv.value
        };

        fetch("/secure", {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body   : JSON.stringify(data)
        }).then(function(result) {
            return result.json();
        }).then(function(json) {
            console.log(json);

            secCardNumber.value = json.cardNumber;
            secCardDate.value   = json.cardDate;
            secCardCvv.value    = json.cardCvv;

            cardNumber.value = "";
            cardDate.value   = "";
            cardCvv.value    = "";

            revealButton.removeAttribute("disabled");
        });
    };

    var revealFunction = function() {
        var data = {
            cardNumber: secCardNumber.value,
            cardDate  : secCardDate.value,
            cardCvv   : secCardCvv.value
        };

        fetch("/reveal", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }).then(function(result) {
            return result.json();
        }).then(function(json) {
            console.log(json);

            cardNumber.value = json.cardNumber;
            cardDate.value   = json.cardDate;
            cardCvv.value    = json.cardCvv;

            secCardNumber.value = "";
            secCardDate.value   = "";
            secCardCvv.value    = "";

            revealButton.setAttribute("disabled", true);
        });
    };

    sendButton.addEventListener("click", sendFunction);
    revealButton.addEventListener("click", revealFunction);
})();