// 1. A list of tasks rendered in the DOM based on data from the ATDAPI server.
// 2. Each task has a description, a remove button, and a mark complete/active button.
// 3. An input element and a button that lets user add a new task.
// 4. Bonus feature: A toggle to show Active/Complete/All tasks only

// {success:true,id:426}

$(document).ready(function () {
  console.log("Document loaded");

  // get initial JSON
  var renderData = function () {
    $("#list").empty();
    $.ajax({
      type: "GET",
      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=426",
      dataType: "json",
      success: function (response, textStatus) {
        console.log("Loaded: " + textStatus);
        //   Use to loop over data array and display
        response.tasks.forEach(function (item) {
          if (item.completed == false) {
            isChecked = "";
          } else isChecked = "checked";
          console.log(item);
          $("#list").append(
            "<div class='row row-cols-auto align-items-center py-2'>" +
              "<div class='flex-grow-1 item'>" +
              "<input type='checkbox' class='check-item' />" +
              "<span data-id='" +
              item.id +
              "' class='item-name'>" +
              item.content +
              "</span>" +
              "</div>" +
              "<button class='btn btn-danger remove'>delete</button>" +
              "</div>"
          );
        });
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  // add item
  $("#add-item").on("click", "button", function () {
    console.log("clicked");
    var itemName = $(".input-entry").val();
    //AJAX request here
    $.ajax({
      type: "POST",
      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=426",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        task: {
          content: itemName,
        },
      }),
      success: function (response, textStatus) {
        console.log(response);
        renderData();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
    $(".input-entry").val("");
  });

  // remove item
  $("#list").on("click", "button.remove", function () {
    // Note: Had an issue targetting dynamic elements after added. Solution was to target the parent element that holds the added items, and then to select the correct element as an argument.
    var itemId = $(this).prev().find(".item-name").data("id");
    console.log(itemId);
    $.ajax({
      type: "DELETE",
      url:
        "https://altcademy-to-do-list-api.herokuapp.com/tasks/" +
        itemId +
        "?api_key=426",
      success: function (response, textStatus) {
        console.log("Delete: " + response);
        renderData();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  });

  // all checked items are crossed out
  $("#list").on("click", ".check-item", function () {
    var checked = $(this).prop("checked");
    var itemId = $(this).next().data("id");
    $.ajax({
      type: "PUT",
      url:
        "https://altcademy-to-do-list-api.herokuapp.com/tasks/" +
        itemId +
        "?api_key=426",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        //change content here
        completed: checked,
      }),
      success: function (response, textStatus) {
        console.log(textStatus);
        renderData();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  });
  renderData();
});
