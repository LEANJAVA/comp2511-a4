function Game($form)
{
    this.$form = $form;
    this.$gamearea = $('#gameArea');
    this.url = "http://ins.mtroyal.ca/~nkhemka/test/process.php";
    this.cards = [];
    this.players = [];
    var _ = this;
    this.$form.submit(function (e) {
        e.preventDefault();
        _.start();

    });


}

Game.prototype.start = function ()
{
    var _ = this;
    $.when($.post(_.url, _.$form.serialize())).done(function (data) {

        var players = _.$form.serializeArray();
        _.setPlayer(players[0].value);
        _.setPlayer(players[1].value);
        _.setCards(JSON.parse(data));
    });


};

Game.prototype.setPlayer = function (name) {
    this.players.push(new Player(name));
};

Game.prototype.setCards = function (o)
{
    for (var i = 0; i < o.Cards.lenth; i++) {
        this.cards.push(new Card(this, o.Cards[i].value));
    }

};