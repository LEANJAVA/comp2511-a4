function Player(game, name)
{
    var _ = this;
    _.game = game;
    _.name = name;
    _.score = 0;
    _.$scoreboard = $('#score');
    $.when(_.game.loadTemplate("score", {
        "name": _.name,
        "score": _.score
    })).done(function (scoreSheet) {
        _.$el = $(scoreSheet).appendTo(_.$scoreboard);
    });
}


Player.prototype.updateScore = function () {
    var _ = this;
    _.score += 10;
    _.$el.find('.score').html(_.score);
};

