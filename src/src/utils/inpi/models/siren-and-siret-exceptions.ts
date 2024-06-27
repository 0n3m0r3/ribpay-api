/** COMMON ERRORS */

import { HttpBadRequestError } from "../network/http-exceptions.js";

/**
 * This look like a siren but does not respect Luhn formula
 */
export class NotLuhnValidSirenError extends HttpBadRequestError {
  constructor(message) {
    super(`Not a valid siren : ${message}`);
  }
}

/**
 * This does not even look like a siren
 */
export class NotASirenError extends HttpBadRequestError {
  constructor(message) {
    super(`Not a siren : ${message}`);
  }
}

/**
 * This look like a siret but does not respect Luhn formula
 */
export class NotLuhnValidSiretError extends HttpBadRequestError {
  constructor(message) {
    super(`Not a valid siret : ${message}`);
  }
}

/**
 * This does not even look like a siret
 */
export class NotASiretError extends HttpBadRequestError {
  constructor(message) {
    super(`Not a siret : ${message}`);
  }
}
