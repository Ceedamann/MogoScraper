$.getJSON("/articles", function(data){
    for (let i = 0; i < data.length; i++) {
        var deals = ("https://slickdeals.net"+ data[i].link)
        $("#deals").append("<p data-id='" + data[i]._id + "'>" + data[i].title +"</p>")
        .append(`<img src = ${data[i].img}>`)
        .append(`<a href = ${deals}>seeMore`)
        
    }
})