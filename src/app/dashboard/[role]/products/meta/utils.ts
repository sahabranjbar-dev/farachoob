export const persianToEnglishDigits = (str: string) =>
  str.replace(/[\u06F0-\u06F9]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 1728)
  );

export const formatWithCommas = (value: string) => {
  const numStr = value.replace(/,/g, "");
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("fa-IR");
};

export const unformat = (val: string) =>
  persianToEnglishDigits(val).replace(/,/g, "");
