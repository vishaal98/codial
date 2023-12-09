const nodeMailer = require("../config/nodemailer");
require("dotenv").config();

exports.newPost = (post) => {
  let htmlString = nodeMailer.renderTemplate(
    { post: post },
    "/posts/new_post.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      from: process.env.EMAIL_SENDER,
      to: post.user.email,
      subject: "New Post Published",
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
