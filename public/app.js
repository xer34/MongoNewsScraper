$.getJSON("/articles", data => {
  for (let i = 0; i < data.length; i++) {
    $("#articles").append(
      `<p class='title' data-id='${data[i]._id}'>${data[i].title}<br />
      <br>
      <p>${data[i].summary}</p>
      <a href='${data[i].link}' class='w3-button w3-red'>Link</a>
      <button class='w3-button w3-blue noteButton' data-id='${data[i]._id}'>Note</button>
      <br/>
      <p>----------------------------------</p>`
    );
  }
});
$(document).on("click", ".noteButton", function() {
  $("#notes").empty();
  const thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: `/articles/${thisId}`
  }).then(data => {
    $("#notes").append(`<h2>${data.title}</h2>`);
    $("#notes").append("<input id='titleinput' name='title' >");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append(
      `<button data-id='${data._id}' id='savenote'>Save Note</button>`
    );
    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
});
$(document).on("click", "#savenote", function() {
   var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});