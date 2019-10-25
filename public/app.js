$.getJSON("/deals", function (data) {
    for (let i = 0; i < 5; i++) {
        var deals = ("https://slickdeals.net" + data[i].link)
        $("#deals").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>")
            .append(`<img src = ${data[i].img}>`)
            .append(`<a href = ${deals}>seeMore`)

    }
})
$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: "/deals/" + thisId
        })
        .then(function (data) {
            console.log(data);
            $("#notes").append(`<h4> ${data.title}`);
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/deals/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });