class PostComments {
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);
    let self = this;
    // call for all the existing comments
    $(" .delete-comment-button", this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }
  createComment(postId) {
    let parentSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let selfCommentForm = this;
      $.ajax({
        type: "post",
        url: "/comments/create-comment",
        data: $(selfCommentForm).serialize(),
        success: function (data) {
          let newComment = parentSelf.newCommentDom(data.data.comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          parentSelf.deleteComment($(" .delete-comment-button", newComment));

          $(`#${postId}-comment-content`).val("");

          //to show the notification
          new Noty({
            theme: "relax",
            text: "Comment published!",
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
  }

  newCommentDom(comment) {
    // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
    return $(`<li id="comment-${comment._id}">
                        <p>
                            <small>
                                ${comment.user.name}
                            </small>
                            <small>
                            <a class="delete-comment-button" href="/comments/delete-comment/${comment._id}"><i class="fa-regular fa-trash-can" style="color: #000000;"></i></a>
                            </small>
                        </p> 
                        <p>
                        ${comment.content}
                        </p>   

                </li>`);
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();

          //to show the notification
          new Noty({
            theme: "relax",
            text: "Comment Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}
