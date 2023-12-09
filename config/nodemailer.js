const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smpt.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "vishnair001@gmail.com",
    pass: "@Ajhpn7042f@Gmail",
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("Error in Rendering: ".err);
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
