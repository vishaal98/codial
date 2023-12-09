const nodeMailer = require("../config/nodemailer");
require("dotenv").config();

exports.newComment = (comment, post) => {
  let htmlString = nodeMailer.renderTemplate(
    { comment: comment, post: post },
    "/comments/new_comment.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: process.env.EMAIL_SENDER,
      to: post.user.email,
      subject: "New Comment Published",
      html: htmlString,
    },
    (err) => {
      if (err) {
        console.log("Error sending the email: ".err);
        return;
      }
      console.log("Email Sent Successfully");
      return;
    }
  );
};
