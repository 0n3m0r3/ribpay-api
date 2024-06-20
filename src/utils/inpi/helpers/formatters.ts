export const capitalize = (str) => {
  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};

export const formatIntFr = (intAsString = "") => {
  try {
    return intAsString.replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
  } catch (e) {
    return intAsString;
  }
};

export const formatFloatFr = (floatAsString = "") => {
  try {
    const floatAsNumber = parseFloat(floatAsString);
    return new Intl.NumberFormat("fr-FR").format(floatAsNumber);
  } catch {
    return floatAsString;
  }
};

/**
 * Normalize string and remove special chars & diacritics before using a term in search
 */
export const escapeTerm = (term) => {
  return term
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+$/, "")
    .replace(/^\s+/, "");
};

export const formatFirstNames = (firstNamesRaw) => {
  const firstNames = firstNamesRaw.split(/[,\s]+/);

  if (firstNames.length > 0) {
    return capitalize(firstNames[0]);
  }
  return "";
};

export const formatNameFull = (nomPatronymique = "", nomUsage = "") => {
  if (nomUsage && nomPatronymique) {
    return `${capitalize(nomUsage)} (${capitalize(nomPatronymique)})`;
  }
  return capitalize(nomUsage || nomPatronymique || "");
};

export const formatAddress = (address) => {
  if (!address) {
    return null;
  }

  // Formating typeVoie
  address.typeVoie = libelleFromTypeVoie(address.typeVoie);

  if (address.voie.includes(address.numVoie)) {
    address.voie = address.voie.replace(address.numVoie, "").trim();
  }

  if (address.voie.includes(address.typeVoie)) {
    address.voie = address.voie.replace(address.typeVoie, "").trim();
  }

  if (
    address.indiceRepetition &&
    address.voie.includes(address.indiceRepetition)
  ) {
    address.voie = address.voie.replace(address?.indiceRepetition, "").trim();
  }

  if (
    address.complementLocalisation &&
    address.voie.includes(address.complementLocalisation)
  ) {
    address.voie = address.voie
      .replace(address.complementLocalisation, "")
      .trim();
  }

  if (
    address.distributionSpeciale &&
    address.voie.includes(address.distributionSpeciale)
  ) {
    address.voie = address.voie
      .replace(address.distributionSpeciale, "")
      .trim();
  }

  const formatted = {
    code_postal: address.codePostal.toUpperCase() || "",
    libelle_commune: address.commune.toUpperCase() || "",
    type_voie: address.typeVoie.toUpperCase() || "",
    libelle_voie: address.voie.toUpperCase() || "",
    numero_voie: address.numVoie || "",
    pays: address.pays.toUpperCase() || "",
    code_pays: address.codePays || "",
    code_insee_commune: address.codeInseeCommune || "",
    complement: address.complementLocalisation?.toUpperCase() || "",
    indice_repetition: address.indiceRepetition?.toUpperCase() || "",
    distribution_speciale: address.distributionSpeciale?.toUpperCase() || "",
    adresse: `${
      address.complementLocalisation ? address.complementLocalisation + " " : ""
    }${address.numVoie}${
      address.indiceRepetition ? " " + address.indiceRepetition : ""
    } ${address.typeVoie} ${address.voie} ${
      address.distributionSpeciale ? address.distributionSpeciale + " " : ""
    }${address.codePostal} ${address.commune}`,
  };

  return formatted;
};

export const siretToSiren = (siret) => {
  return siret.slice(0, 9);
};

const libelleFromTypeVoie = (codeVoie = "") => {
  //@ts-ignore
  return codesVoies[codeVoie] || codeVoie;
};

export function formatBeneficiaryNameForOxlin(name) {
  const nameSliced = name.slice(0, 140);
  // https://stackoverflow.com/a/37511463
  const nameCleaned = nameSliced
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  const regex = /[^A-Za-z0-9 ,-]/g;

  const nameFormatted = getFormatedString({ string: nameCleaned, regex });

  return nameFormatted;
}

function getFormatedString({ string, regex, replaceWith = " " }) {
  const stringFormatted = string.replace(regex, replaceWith);

  return stringFormatted;
}

const codesVoies = {
  AIRE: "Aire",
  ALL: "Allée",
  AV: "Avenue",
  BASE: "Base",
  BD: "Boulevard",
  CAMI: "Cami",
  CAR: "Carrefour",
  CHE: "Chemin",
  CHEM: "Cheminement",
  CHS: "Chaussée",
  CITE: "Cité",
  CLOS: "Clos",
  COIN: "Coin",
  COR: "Corniche",
  COTE: "Cote",
  COUR: "Cour",
  CRS: "Cours",
  DOM: "Domaine",
  DSC: "Descente",
  ECA: "Ecart",
  ESP: "Esplanade",
  FG: "Faubourg",
  GARE: "Gare",
  GR: "Grande Rue",
  HAM: "Hameau",
  HLE: "Halle",
  ILOT: "Ilôt",
  IMP: "Impasse",
  LD: "Lieu dit",
  LOT: "Lotissement",
  MAR: "Marché",
  MTE: "Montée",
  PARC: "Parc",
  PAS: "Passage",
  PL: "Place",
  PLAN: "Plan",
  PLN: "Plaine",
  PLT: "Plateau",
  PONT: "Pont",
  PORT: "Port",
  PRO: "Promenade",
  PRV: "Parvis",
  QUA: "Quartier",
  QUAI: "Quai",
  RES: "Résidence",
  RLE: "Ruelle",
  ROC: "Rocade",
  RPT: "Rond Point",
  RTE: "Route",
  RUE: "Rue",
  SEN: "Sente - Sentier",
  SQ: "Square",
  TOUR: "Tour",
  TPL: "Terre-plein",
  TRA: "Traverse",
  VLA: "Villa",
  VLGE: "Village",
  VOIE: "Voie",
  ZA: "Zone artisanale",
  ZAC: "Zone d’aménagement concerté",
  ZAD: "Zone d’aménagement différé",
  ZI: "Zone industrielle",
  ZONE: "Zone",
};
