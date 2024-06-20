import { HttpNotFound } from "./network/http-exceptions";
import { authApiRneClient } from "./network/auth-inpi";
import { formatFloatFr } from "./helpers/formatters";

import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeNatureEntreprise,
  libelleFromCodeRoleEntreprise,
} from "./labels";
import { formatINPIDateField } from "./helpers/helpers";
import { formatAddress } from "./helpers/formatters";

export const fetchImmatriculationFromAPIRNE = async (siren) => {
  const response = await authApiRneClient(
    "https://registre-national-entreprises.inpi.fr/api/companies/" + siren,
    { timeout: 30000 }
  );

  const data = response.data;

  if (data.formality.content.personnePhysique) {
    return mapPersonnePhysiqueToDomainObject(
      data.formality.content.personnePhysique,
      data.formality.content.formeExerciceActivitePrincipale,
      data.formality.content,
      siren
    );
  }
  if (data.formality.content.personneMorale) {
    return mapPersonneMoraleToDomainObject(
      data.formality.content.personneMorale,
      data.formality.content.formeExerciceActivitePrincipale,
      data.formality.content,
      siren
    );
  }
  throw new HttpNotFound(siren);
};

const mapPersonneMoraleToDomainObject = (
  pm,
  natureEntreprise = "",
  content,
  siren
) => {
  let adresse;
  if (isValidAddress(pm?.etablissementPrincipal?.adresse)) {
    adresse = pm?.etablissementPrincipal?.adresse;
  } else if (isValidAddress(pm?.adresseEntreprise?.adresse)) {
    adresse = pm?.adresseEntreprise?.adresse;
  } else {
    throw new HttpNotFound(siren);
  }

  let formattedAddress = formatAddress(adresse);
  if (!formattedAddress) {
    throw new HttpNotFound("Valid address not found for SIREN: " + siren);
  }

  const isActive = isCompanyActive(content);

  const {
    montantCapital = 0,
    deviseCapital = "€",
    capitalVariable = false,
    duree = 0,
    dateClotureExerciceSocial = "",
  } = pm?.identite.description || {};

  const {
    denomination = "",
    formeJuridique = "",
    dateImmat = "",
    nomCommercial = "",
    sigle = "",
    dateDebutActiv = "",
  } = pm?.identite.entreprise || {};

  const denominationComplete = `${denomination || "Nom inconnu"}${
    nomCommercial ? ` (${nomCommercial})` : ""
  }${sigle ? ` (${sigle})` : ""}`;

  const capital = montantCapital
    ? `${formatFloatFr(montantCapital.toString())} ${deviseCapital} (${
        capitalVariable ? "variable" : "fixe"
      })`
    : "";

  const typePersonne = "personneMorale";

  return {
    siren,
    isActive,
    typePersonne,
    identite: {
      denomination: denominationComplete,
      dateImmatriculation: formatINPIDateField(dateImmat || "").split("T")[0],
      dateDebutActiv: dateDebutActiv,
      dateRadiation: formatINPIDateField(
        (pm?.detailCessationEntreprise?.dateRadiation || "").split("T")[0]
      ),
      dateCessationActivite: "",
      isPersonneMorale: true,
      dateClotureExercice: dateClotureExerciceSocial,
      dureePersonneMorale: duree ? `${duree.toString()} ans` : "",
      capital,
      libelleNatureJuridique: libelleFromCategoriesJuridiques(formeJuridique),
      natureEntreprise: libelleFromCodeNatureEntreprise(natureEntreprise),
    },
    adresse: formattedAddress,
    dirigeants:
      (pm?.composition?.pouvoirs || []).map((p) => {
        if (!!p.individu) {
          const {
            nom = "",
            prenoms = [],
            nomUsage = "",
            dateDeNaissance = "",
          } = p.individu?.descriptionPersonne || {};
          return {
            nom,
            prenom: prenoms[0],
            nomUsage,
            role: "",
            dateNaissancePartial: dateDeNaissance,
            dateNaissanceFull: "",
          };
        } else {
          const {
            siren = "",
            denomination = "",
            roleEntreprise = "",
            formeJuridique = "",
          } = p.entreprise || {};

          return {
            siren,
            denomination,
            natureJuridique: formeJuridique,
            role: libelleFromCodeRoleEntreprise(roleEntreprise),
          };
        }
      }) || [],
    beneficiaires:
      (pm?.beneficiairesEffectifs || []).map((b) => {
        const {
          dateDeNaissance = "",
          nom = "",
          prenoms = "",
          nationalite,
        } = b?.beneficiaire?.descriptionPersonne || {};

        return {
          type: "",
          nom,
          prenoms: prenoms.join(", "),
          dateNaissancePartial: dateDeNaissance,
          nationalite,
        };
      }) || [],
    observations:
      (pm?.observations?.rcs || []).map((o) => {
        const { numObservation = "", texte = "", dateAjout = "" } = o || {};
        return {
          numObservation,
          description: texte.trimStart().trimEnd(),
          dateAjout: formatINPIDateField(dateAjout),
        };
      }) || [],
    metadata: {
      isFallback: false,
    },
  };
};

const mapPersonnePhysiqueToDomainObject = (
  pp,
  natureEntreprise = "",
  content,
  siren
) => {
  const {
    dateImmat = "",
    formeJuridique = "",
    dateDebutActiv = "",
  } = pp?.identite?.entreprise || {};

  let adresse;
  if (isValidAddress(pp?.etablissementPrincipal?.adresse)) {
    adresse = pp?.etablissementPrincipal?.adresse;
  } else if (isValidAddress(pp?.adresseEntreprise?.adresse)) {
    adresse = pp?.adresseEntreprise?.adresse;
  } else {
    throw new HttpNotFound(siren);
  }

  let formattedAddress = formatAddress(adresse);
  if (!formattedAddress) {
    throw new HttpNotFound("Valid address not found for SIREN: " + siren);
  }

  const isActive = isCompanyActive(content);

  const {
    prenoms = [""],
    nomUsage = "",
    nom = "",
  } = pp?.identite.entrepreneur?.descriptionPersonne || {};
  const prenom = prenoms[0];

  const nomCommercial =
    pp?.etablissementPrincipal?.descriptionEtablissement?.nomCommercial || "";

  const denomination = `${prenom} ${
    nomUsage && nom ? `${nomUsage} (${nom})` : `${nomUsage || nom || ""}`
  }`;

  const denominationComplete = nomCommercial || denomination || "Nom inconnu";

  const typePersonne = "personnePhysique";

  return {
    siren,
    isActive,
    typePersonne,
    identite: {
      denomination: denominationComplete || "",
      dateImmatriculation: formatINPIDateField(dateImmat || "").split("T")[0],
      dateDebutActiv,
      dateRadiation: formatINPIDateField(
        (pp?.detailCessationEntreprise?.dateRadiation || "").split("T")[0]
      ),
      dateCessationActivite: "",
      isPersonneMorale: false,
      dateClotureExercice: "",
      dureePersonneMorale: "",
      capital: "",
      libelleNatureJuridique: libelleFromCategoriesJuridiques(formeJuridique),
      natureEntreprise: libelleFromCodeNatureEntreprise(natureEntreprise),
    },
    adresse: formattedAddress,
    dirigeants: [
      {
        nom,
        prenom,
        nomUsage,
        role: "",
        dateNaissancePartial: "",
        dateNaissanceFull: "",
      },
    ],
    beneficiaires: [],
    observations: [],
    metadata: {
      isFallback: false,
    },
  };
};

const isValidAddress = (address) => {
  if (!address) {
    return false;
  }

  return (
    address.codePostalPresent &&
    address.communePresent &&
    // address.typeVoiePresent &&
    address.voiePresent
    // address.numVoiePresent
  );
};

const isCompanyActive = (data) => {
  if (data.hasOwnProperty("natureCessation")) {
    return false;
  }

  if (data.hasOwnProperty("evenementCessation")) {
    return false;
  }

  if (data.hasOwnProperty("detailCessationEntreprise")) {
    return false;
  }

  return true;
};
