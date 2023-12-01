{
  //method to submit the form data for new post using Ajax
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create-post",
        data: newPostForm.serialize(),
        success: function (data) {
          //   console.log(data);
          let newPost = newPostDOM(data.data.post);
          $("#post-list-container>ul").prepend(newPost);
          newPostForm[0].reset();
          deletePost($(" .delete-post-button", newPost));

          //call the create comment class
          new PostComments(data.data.post._id);

          //to show the notification
          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  //method to create a post in DOM
  let newPostDOM = function (post) {
    return $(`<li id="post-${post._id}">
  <p>
    <small> ${post.user.name} </small>
    <small
      ><a class="delete-post-button" href="/posts/delete-post/${post._id}"
        >DELETE</a
      ></small
    >
  </p>
  <h4>${post.content}</h4>
  <div id="post-comments">
    <h4>Comments:</h4>
    
    <form
      action="/comments/create-comment"
      id="post-${post._id}-comments-form"
      method="POST"
    >
      <input
        type="text"
        name="content"
        placeholder="Add a comment here..."
        required
      />
      <input type="hidden" name="post" value="${post._id}" />
      <input type="submit" value="Add Comment" />
    </form>
    <div class="post-comments-list">
      <ul id="post-comments-${post._id}">
      </ul>
    </div>
  </div>
</li>
<hr/>
`);
  };

  //method to delete a post from the DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();

          //to how the notification
          new Noty({
            theme: "relax",
            text: "Post Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $("#post-list-container>ul>li").each(function () {
      // console.log("to check this works");
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];
      //   new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
