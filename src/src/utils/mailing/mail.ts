import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses"; // ES Modules import
import { readFileSync } from "fs";
import { join } from "path";


// const { SESClient, SendRawEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
const client = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "eu-north-1",
});


// The following example sends an email with an attachment:

interface SendMailInput {
  attachment: string;
  file_name: string;
  mail_subject: string;
  mail_body: string;
}

export async function sendMail({ attachment, file_name, mail_subject, mail_body } : SendMailInput) {



  const input = {
      "Destinations": ["reallucas3@gmail.com"],
      "FromArn": "arn:aws:ses:eu-north-1:010438509159:identity/louka.altdorfreynes@gmail.com",
      "RawMessage": {
        "Data": new TextEncoder().encode(`From: louka.altdorfreynes@gmail.com\nTo: reallucas3@gmail.com\nSubject: ${mail_subject}\nMIME-Version: 1.0\nContent-type: Multipart/Mixed; boundary=\"NextPart\"\n\n--NextPart\nContent-Type: text/plain\n\n${mail_body}\n\n--NextPart\nContent-Type: application/pdf;\nContent-Disposition: attachment; filename=\"${file_name}\"\nContent-Transfer-Encoding: base64\n\n${attachment}\n\n--NextPart--`)
      },
      "ReturnPathArn": "",
      "Source": "louka.altdorfreynes@gmail.com",
      "SourceArn": ""
    };

    const command = new SendRawEmailCommand(input);
    const response = await client.send(command);

    console.log(response); 
}
