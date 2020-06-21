require("dotenv").config();

exports.handler = async (data, _context, callback) => {
  const mailgun = require("mailgun-js");

  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  const json = JSON.parse(data.body);

  const mailObject = {
    from: `Contact Form <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to: `${process.env.RECIPIENT}`,
    subject: `From: ${json.name} + Company: ${json.company}`,
    text: `
      Email: ${json.email} \n
      Message: ${json.message}
    `,
  };

  try {
    if (!json.email) {
      throw "Error: email not given";
    }
    const resp = await mg.messages().send(mailObject);
    console.log("response " + JSON.stringify({ resp }));

    return {
      statusCode: 200,
      body: "Your message was sent successfully! We'll be in touch.",
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: "Problem sending mail",
    };
  }
};
