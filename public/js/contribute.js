$(document).ready(function() {
  // Getting jQuery references to the post body, title, form, and author select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  var authorSelect = $("#author");
  
  $(cmsForm).on("submit", handleFormSubmit);
  
  var url = window.location.search;
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData1(postId);
  }

  getAuthors();

  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (!bodyInput.val().trim() || !authorSelect.val()) {
      return;
    }
    var contributedPost = {
      title:$("#post-title").text(),
      body: $("#post-original-body").text() + "\n"+ bodyInput.val().trim(),
      AuthorId: authorSelect.val()
    }

    contributePost(contributedPost);
  }

  function contributePost(post){
    //TODO:
    console.log(window.location.href);
    console.log(post)
    $.post(window.location.href, post, function(){
      window.location.href = "/blog";
    })
  }

  function getPostData1(id) {
    var queryUrl = "/api/posts/" + id;
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data)
        // If this post exists, prefill our cms forms with its data
        $('#post-title').text(data.title);
        $('#post-original-body').text(data.body);
        authorId = data.AuthorId || data.id;
      }
    });
  }

  function getAuthors() {
    $.get("/api/authors", renderAuthorList);
  }
  // Function to either render a list of authors, or if there are none, direct the user to the page
  // to create an author first
  function renderAuthorList(data) {
    if (!data.length) {
      window.location.href = "/authors";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createAuthorRow(data[i]));
    }
    authorSelect.empty();
    console.log(rowsToAdd);
    console.log(authorSelect);
    authorSelect.append(rowsToAdd);
    // authorSelect.val(authorId);
  }

  function createAuthorRow(author) {
    var listOption = $("<option>");
    listOption.attr("value", author.id);
    listOption.text(author.name);
    return listOption;
  }


})