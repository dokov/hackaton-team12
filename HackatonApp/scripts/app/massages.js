var app = app || {};
app.massages = (function(){
    var viewModel = kendo.observable({
    noPlacesLeft: function(e) {
        alert("Sorry, there are no places left!");
    }
    });

    return {
        massagesModel: viewModel
    };
}());