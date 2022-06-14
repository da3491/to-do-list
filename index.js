// 1. A list of tasks rendered in the DOM based on data from the ATDAPI server.
// 2. Each task has a description, a remove button, and a mark complete/active button.
// 3. An input element and a button that lets user add a new task.
// 4. Bonus feature: A toggle to show Active/Complete/All tasks only

// {success:true,id:426}

$(document).ready(function () {
  var filterState;
  $("#filter-btns").on("click", "button", function () {
    filterState = this.id;
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
    getAndRenderData();
  });

  // Adding html to display JSON data
  var renderItem = function (item) {
    $("#list").append(
      "<div class='row row-cols-auto align-items-center py-2'>" +
        "<div class='flex-grow-1 item'>" +
        "<input data-id='" +
        item.id +
        "' type='checkbox' class='check-item me-3' " +
        (item.completed ? "checked" : "") +
        "/>" +
        "<span data-id='" +
        item.id +
        "' class='item-name'>" +
        item.content +
        "</span>" +
        "</div>" +
        "<button data-id='" +
        item.id +
        "' class='btn btn-danger remove'>delete</button>" +
        "</div>"
    );
  };

  // AJAX GET, forEach renderItem
  var getAndRenderData = function () {
    $("#list").empty();
    $.ajax({
      type: "GET",
      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=426",
      dataType: "json",
      success: function (response, textStatus) {
        switch (filterState) {
          case "filter-active":
            response.tasks
              .filter((item) => item.completed == false)
              .forEach((item) => renderItem(item));
            break;
          case "filter-completed":
            response.tasks
              .filter((item) => item.completed == true)
              .forEach((item) => renderItem(item));
            break;
          case "filter-all":
          default:
            response.tasks.forEach((item) => renderItem(item));
            break;
        }
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  // AJAX POST
  $("#add-item").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=426",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        task: {
          content: $(".input-entry").val(),
        },
      }),
      success: function (response, textStatus) {
        getAndRenderData();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
    $(".input-entry").val("");
  });

  // AJAX DELETE
  $(document).on("click", ".remove", function () {
    // Note: Had an issue targetting dynamic elements after added. Solution was to target the parent element that holds the added items, and then to select the correct element as an argument.
    var itemId = $(this).prev().find(".item-name").data("id");
    $.ajax({
      type: "DELETE",
      url:
        "https://altcademy-to-do-list-api.herokuapp.com/tasks/" +
        itemId +
        "?api_key=426",
      success: function (response, textStatus) {
        getAndRenderData();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  });

  // AJAX PUT
  $(document).on("change", ".check-item", function () {
    // Note: Issue with changing the completed status on PUT request. Will not return saved value.
    $.ajax({
      type: "PUT",
      url:
        "https://altcademy-to-do-list-api.herokuapp.com/tasks/" +
        $(this).data("id") +
        "/mark_" +
        (this.checked ? "complete" : "active") +
        "?api_key=426",
      contentType: "application/json",
      dataType: "json",
      success: function (response, textStatus) {
        getAndRenderData();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  });

  getAndRenderData();
});
