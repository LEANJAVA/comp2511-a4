function Player(name)
{
    var _ = this;
    this.name = name;
    this.score = 0;
    this.$scoreboard = $('#score');


    $.when(this.loadTemplate("score", {
        "name": _.name,
        "score": _.score
    })).done(function (scoreSheet) {
        _.$el = $(scoreSheet).appendTo(_.$scoreboard);
        console.log(_);
    });

}

Player.prototype.loadTemplate = function (url, o)
{
    var dfd = $.Deferred();
    $.get("app/templates/" + url + ".html").done(function (response) {
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
