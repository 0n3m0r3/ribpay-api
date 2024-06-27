import uuidAPIKey from "uuid-apikey";

// https://support.slimpay.com/s/article/Les-diff%C3%A9rents-modes-de-cr%C3%A9ation-de-mandats-de-pr%C3%A9l%C3%A8vements#RUM
export const generateReference = ({ prefix, contractId }) => {
  // https://github.com/chronosis/uuid-apikey#toapikeyuuid-options
  const mandateId = uuidAPIKey.toAPIKey(contractId, { noDashes: true });

  return `${prefix}_${mandateId}`;
};
