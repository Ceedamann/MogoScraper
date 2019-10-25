$.getJSON("/deals", function (data) {
  for (let i = 0; i < data.length; i++) {
    var deals = ("https://slickdeals.net" + data[i].link)
    var col = $("<div>");
    col.addClass("col-sm-12 col-md-6 col-lg-4 col-xl-3");
    var div = $("<div>");
    div.addClass("card");
    var img = $("<img>");
    img.addClass("card-img-top");
    img.attr("src", data[i].img);
    img.attr("id","img")
    var div2 = $("<div>");
    div2.addClass("card-body");
    var title = $("<p>");
    title.addClass("card-title");
    title.attr('data-id', data[i]._id);
    title.text(data[i].title);
    title.attr("id","title")
    var link = $("<a>");
    link.attr("target", "_blank")
    link.attr("href", deals);
    link.addClass("btn btn-primary");
    link.text("See Deal");
    link.attr("id","link");
    var figure = $("<figure>")

    figure.append(img)
    div.append(figure);
    div2.append(title);
    div2.append(link);
    div.append(div2);
    col.append(div);
    $("#deals").prepend(col);
  }
})
$(document).on("click", "p", function () {
  $("#dealsComment").empty();
  $("#input").empty();
  $("#text").empty();
  $("#butt").empty();

  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "GET",
      url: "/deals/" + thisId
    })
    .then(function (data) {
      $("#comments").modal("toggle");
      console.log(data);
      var comtitle = $("<h5>")
      comtitle.addClass("modal-title");
      comtitle.text(data.title);
      $("#dealsComment").append(comtitle);
      var input = $("<input>");
      input.addClass("form-control");
      input.attr("type", "text");
      input.attr("placeholder", "Title");
      input.attr("id", "titleinput");
      input.attr("name", 'title');
      $("#input").append(input);
      var text = $("<textarea>");
      text.addClass("form-control");
      text.attr("rows", "3");
      text.attr("id", 'bodyinput');
      text.attr("name", 'body');
      $("#text").append(text);
      var button = $("<button>");
      button.addClass("btn btn-success");
      button.attr("type", "button");
      button.attr("data-id", data._id);
      button.attr("id", 'savenote');
      button.text("Save Comment");
      var close = $("<button>");
      close.attr("type", "button");
      close.addClass("btn btn-secondary");
      close.attr("data-dismiss", "modal");
      close.text("Close");
      $("#butt").append(button);
      $("#butt").append(close);
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});
$(document).on("click", "#savenote", function () {
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
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});