function Card(game, value)
{
    var _ = this;
    _.game = game;
    _.value = value;
    _.$el = null;
    _.selected = false;
    $.when(_.game.loadTemplate('card', {
        "value": _.stringValue()
    })).done(function (el) {
        _.$el = $(el);

        _.$el.appendTo(_.game.$gamearea);
        _.$el.click(function () {
            _.selected = !_.selected;
            _.changeState();
        });
    });

}

Card.prototype.stringValue = function ()
{
    var str;
    switch (this.value) {
        case 0:
            str = "zero";
            break;
        case 1:
            str = "one";
            break;
        case 2:
            str = "two";
            break;
        case 3:
            str = "three";
            break;
        case 4:
            str = "four";
            break;
        default:
            str = "zero";
            break;
    }
    return str;
};

Card.prototype.changeState = function () {
    var _ = this;
    if (_.selected) {
        _.$el.addClass('selected');
    } else {
        _.$el.removeClass('selected');
    }
};