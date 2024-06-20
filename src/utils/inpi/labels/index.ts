import { codesGreffes } from './codes-greffes';
import { codesBeneficiaires } from './codes-beneficiaires';
import { categoriesJuridiques } from './codes-juridiques';
import { codeRoleEntreprise } from './codes-role-entreprise';
import { codeNatureEntreprise } from './codes-nature-entreprise';

export const libelleFromCodeGreffe = (codeGreffe) => {
  //@ts-ignore
  return codesGreffes[codeGreffe] || codeGreffe;
};

export const libelleFromCodeBeneficiaires = (codeBeneficiaires) => {
  //@ts-ignore
  return codesBeneficiaires[codeBeneficiaires] || codeBeneficiaires;
};

export const libelleFromCategoriesJuridiques = (categorie) =>
  //@ts-ignore
  categoriesJuridiques[categorie] || null;

export const libelleFromCodeRoleEntreprise = (code) =>
  //@ts-ignore
  codeRoleEntreprise[code] || null;

export const libelleFromCodeNatureEntreprise = (code) =>
  //@ts-ignore
  codeNatureEntreprise[code] || null;
