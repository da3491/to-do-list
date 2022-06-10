// 1. A list of tasks rendered in the DOM based on data from the ATDAPI server.
// 2. Each task has a description, a remove button, and a mark complete/active button.
// 3. An input element and a button that lets user add a new task.
// 4. Bonus feature: A toggle to show Active/Complete/All tasks only

// {success:true,id:426}

$(document).ready(function () {
  console.log("Document loaded");

  var httpRequest = new XMLHttpRequest();
  httpRequest.onload = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        // console.log(JSON.parse(httpRequest.responseText)["tasks"]);
        renderData(JSON.parse(httpRequest.responseText)["tasks"]);
      } else {
        console.log(httpRequest.statusText);
      }
    }
  };
  httpRequest.onerror = function () {
    console.log(httpRequest.statusText);
  };
  httpRequest.open(
    "GET",
    "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=426"
  );
  httpRequest.send(null);

  var renderData = function (data) {
    //   Use to loop over data array and display
    data.forEach(function (e) {
      var itemName = e.content;
      $("#list").append(
        "<div class='flex-grow-1 item'>" +
          "<input type='checkbox' />" +
          "<span class='item-name'>" +
          itemName +
          "</span>" +
          "</div>" +
          "<button class='btn btn-danger'>delete</button>" +
          "</div>"
      );
    });
  };

  // add item
  $("#add-item button").click(function () {
    console.log("clicked");
    var itemName = $(".input-entry").val();
    httpRequest.open(
      "POST",
      "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=426"
    );
    httpRequest.setRequestHeader("Content-Type", "application/json");
    var newTask = JSON.stringify({
      task: {
        content: itemName,
        completed: false,
      },
    });
    httpRequest.send(newTask);
    //
  });

  // remove item
  // all checked items are crossed out
});
