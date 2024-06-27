export function formatLabelForOxlin(label) {
  const labelSliced = label.slice(0, 50);
  // https://stackoverflow.com/a/37511463
  const labelCleaned = labelSliced
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  const regex = /[^A-Za-z0-9 ?:\(\).,+-\/]/g;

  const labelFormatted = getFormatedString({ string: labelCleaned, regex });

  return labelFormatted;
}

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
