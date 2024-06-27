import {
  NotASirenError,
  NotASiretError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
} from './siren-and-siret-exceptions.js';

/**
 * Siren and siret types
 */

export const isSiren = (slug) => {
  if (!hasSirenFormat(slug) || !isLuhnValid(slug)) {
    return false;
  }
  return true;
};

export const isSiret = (slug) => {
  if (!hasSiretFormat(slug) || !isLuhnValid(slug)) {
    return false;
  }
  return true;
};

/**
 * throw an exception if a string is not a siren
 * */
export const verifySiren = (slug) => {
  if (!isSiren(slug)) {
    if (!hasSirenFormat(slug)) {
      throw new NotASirenError(slug);
    } else {
      throw new NotLuhnValidSirenError(slug);
    }
  }
  return slug;
};

/**
 * Throw an exception if a string is not a siret
 * */
export const verifySiret = (slug) => {
  if (!isSiret(slug)) {
    if (!hasSiretFormat(slug)) {
      throw new NotASiretError(slug);
    } else {
      throw new NotLuhnValidSiretError(slug);
    }
  }
  return slug;
};

/**
 * Siren and siret follow the luhn checksum algorithm except La Poste
 * https://fr.wikipedia.org/wiki/Formule_de_Luhn
 * ex : 889742876 00009 dos not follow Luhn's rule
 *
 * @param siret
 * @returns
 */
const luhnChecksum = (str) => {
  return Array.from(str)
    .reverse()
    .map((character, charIdx) => {
      const num = parseInt(character as string, 10);
      const isIndexEven = (charIdx + 1) % 2 === 0;
      return isIndexEven ? num * 2 : num;
    })
    .reduce((checksum, num) => {
      const val = num >= 10 ? num - 9 : num;
      return checksum + val;
    }, 0);
};

export const isLuhnValid = (str) => {
  // La poste siren and siret are the only exceptions to Luhn's formula
  if (str.indexOf('356000000') === 0) {
    return true;
  }
  return luhnChecksum(str) % 10 == 0;
};

export const isLikelyASiretOrSiren = (slug) => {
  return hasSirenFormat(slug) || hasSiretFormat(slug);
};

export const hasSirenFormat = (str) => !!str.match(/^\d{9}$/g);

export const hasSiretFormat = (str) => !!str.match(/^\d{14}$/g);

export const formatSiret = (siret = '') => {
  return siret.replace(/(\d{3})/g, '$1 ').replace(/(\s)(?=(\d{2})$)/g, '');
};

export const extractSirenFromSiret = (siret) => {
  return verifySiren(siret.slice(0, 9));
};
export const extractSirenFromSiretNoVerify = (siret) => {
  return siret.slice(0, 9);
};

export const extractNicFromSiret = (siret) => {
  return siret.slice(9);
};
