function Game($form)
{
    var _ = this;
    _.$form = $form;
    _.$gamearea = $('#gameArea');
    _.$turnarea = $('#turns');
    _.$endTurn = $('#end-turn');
    _.$endGame = $('#end-game');
    _.onChange = new Event('onChange');
    _.url = "http://ins.mtroyal.ca/~nkhemka/test/process.php";
    _.cards = [];
    _.players = [];
    _.valueToBeat = null;
    _.currentPlayer = 0;
    _.$form.submit(function (e) {
        e.preventDefault();
        e.stopPropagation();
        _.resetBoard();
        _.start();
    });
    _.$endTurn.click(function (e) {
        _.endTurn();
    });

    _.$endGame.click(function (e) {

        if (confirm("Are you sure?")) {
            _.end();
        }
    });


}

Game.prototype.start = function ()
{
    var _ = this;
    $.when(_.loadCards()).done(function (data) {

        var players = _.$form.serializeArray();
        _.setPlayer(players[0].value);
        _.setPlayer(players[1].value);

        var cards = JSON.parse(data).Cards;
        for (var i = 0; i < cards.length - 1; i++) {
            _.setCard(cards[i]);
        }

        _.setValueToBeat(_.cards[0].value);

    });
};

Game.prototype.setPlayer = function (name) {
    this.players.push(new Player(this, name));
};

Game.prototype.setCard = function (o)
{
    this.cards.push(new Card(this, o.value));
};

Game.prototype.resetBoard = function (o) {
    $('.nogame').remove();
    $('.player').remove();
};

Game.prototype.setValueToBeat = function (value) {
    var _ = this;
    _.valueToBeat = value;
    _.nextTurn();
};

Game.prototype.loadTemplate = function (name, o)
{
    var dfd = $.Deferred();
    $.get("app/templates/" + name + ".html").done(function (response) {
        for (var k in o) {
            // gets rid of meta
            if (!o.hasOwnProperty(k)) continue;
            var regex = new RegExp("({{\\s*" + k + "\\s*}})");
            response = response.replace(regex, o[k]);
        }
        dfd.resolve(response);

    });

    return dfd;
};

Game.prototype.getOutcome = function () {
    var sum = 0;
    for (var i = 0; i < this.cards.length; i++) {
        if (this.cards[i].selected) {
            sum += this.cards[i].value;
        }
    }
    return sum > this.valueToBeat;

};

Game.prototype.setNextPlayer = function () {
    if (this.currentPlayer === this.players.length-1) {
        this.currentPlayer = 0;
    } else {
        this.currentPlayer++;
    }
};

Game.prototype.loadCards = function () {
    var _ = this;
    return $.post(_.url, _.$form.serialize())
};

Game.prototype.reloadCards = function () {
    var _ = this;
    _.$gamearea.html("");
    _.cards = [];
    $.when(_.loadCards()).done(function (data) {
        var cards = JSON.parse(data).Cards;
        for (var i = 0; i < cards.length - 1; i++) {
            _.setCard(cards[i]);
        }
        _.setValueToBeat(_.cards[0].value);
    });
};

Game.prototype.nextTurn = function ()
{
    var _ = this;
    $.when(this.loadTemplate('turns', {
        "valueToBeat": _.valueToBeat,
        "player": _.players[_.currentPlayer].name
    })).done(function (turns) {
        _.$turnarea.html(turns);
    });
};

Game.prototype.endTurn = function ()
{

    if (this.getOutcome()) {
        this.players[this.currentPlayer].updateScore();
        alert("Correct! You get 10 points!");
    } else {
        alert("You were close! But no dice...");
    }
    this.reloadCards();
    this.setNextPlayer();
    this.nextTurn();

};

Game.prototype.end = function ()
{
    var _ = this;
    // can be refactored for more players
    if (_.players[0].score > _.players[1].score) {
        alert(_.players[0].name + " won with " + _.players[1] + " points.");
    } else if (_.players[0].score < _.players[1].score) {
        alert(_.players[0].name + " won with " + _.players[1] + " points.");
    } else {
        alert("The game was a tie!");
    }
    _.resetBoard();
    var nogame = "<p class='nogame'>No game in progress</p>";
    _.$gamearea.html(nogame)
    _.$turnarea.html(nogame);
    _.players = [];
    _.cards = [];

};