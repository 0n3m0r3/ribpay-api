import { readFileSync } from "fs";
import { generate } from "@pdfme/generator";
import { Template } from "@pdfme/common";
import { sendMail } from "../mailing/mail";


export interface MonextPDFInput {
  beneficiary_name: string;
  max_amount: string;
  merchant_id: string;
  bank_code: string;
  bank_name: string;
  secure: boolean;
}


export function createMonextPDF({ beneficiary_name, max_amount, merchant_id, bank_code, bank_name, secure }: MonextPDFInput){
  const existingPdfBytes = readFileSync(
    __dirname +
    "/../../../templates/monext/MONEXT_Formulaire de souscription_MonextOnLine.pdf"
  );

  const inputs = [
    {
      beneficiary_name,
      merchant_id: merchant_id.split("").join(" "),
      bank_name,
      bank_code,
      max_amount: "x",
      "3d_secure": secure ? "x" : "",
      url: "store.ribpay.app",
    },
  ];

  const { maxAmountX, maxAmountY } = setMaxAmountPosition({ max_amount });
  console.log({ maxAmountX, maxAmountY });

  const template: Required<Template> = {
    basePdf: existingPdfBytes,
    schemas: [
      {
        beneficiary_name: {
          type: "text",
          position: { x: 125, y: 52 },
          width: 60,
          height: 10,
          fontSize: 8,
        },
        merchant_id: {
          type: "text",
          position: { x: 85, y: 125 },
          width: 100,
          height: 14,
        },
        "3d_secure": {
          type: "text",
          position: { x: 182.5, y: 126.5 },
          width: 16,
          height: 16,
        },
        bank_name: {
          type: "text",
          position: { x: 55, y: 144 },
          width: 100,
          height: 10,
          fontSize: 8,
        },
        bank_code: {
          type: "text",
          position: { x: 160, y: 142 },
          width: 16,
          height: 16,
        },
        max_amount: {
          type: "text",
          position: { x: maxAmountX, y: maxAmountY },
          width: 16,
          height: 16,
        },
        url: {
          type: "text",
          position: { x: 100, y: 75 },
          width: 100,
          height: 10,
        },
      },
    ],
    pdfmeVersion: ""
  };


  const mail_subject = "contrat VADS";
  const file_name = "vads-contract.pdf";
  const mail_body = "Pouvez vous activer ce contrat VADS.";


  generate({ template, inputs }).then((pdf) => {
    const attachment = Buffer.from(pdf).toString("base64");

    sendMail({attachment, file_name, mail_subject, mail_body});
  });

}

function setMaxAmountPosition({ max_amount }: { max_amount: string }): {
  maxAmountX: number;
  maxAmountY: number;
} {
  switch (max_amount) {
    case "100":
      return { maxAmountX: 12.5, maxAmountY: 165 };
    case "250":
      return { maxAmountX: 29.5, maxAmountY: 165 };
    case "500":
      return { maxAmountX: 46.5, maxAmountY: 165 };
    case "1000":
      return { maxAmountX: 62.5, maxAmountY: 165 };
    case "1500":
      return { maxAmountX: 83, maxAmountY: 165 };
    case "2500":
      return { maxAmountX: 103.5, maxAmountY: 165 };
    case "5000":
      return { maxAmountX: 124, maxAmountY: 165 };
    case "10000":
      return { maxAmountX: 144.5, maxAmountY: 165 };
    default: // 10 000
      return { maxAmountX: 144.5, maxAmountY: 165 };
  }
}
