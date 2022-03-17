/**
 * Parse string without error throw.
 * @param {string} json - Json string need to be parsed.
 * @param {object} defaultValue - If parse failed, return defaultValue.
 */
export const safeParseJSON = (json, defaultValue) => {
  let result;
  try {
    result = JSON.parse(json);
  } catch (e) {
    console.log(e);
  }

  if (!result && defaultValue !== undefined) {
    return defaultValue;
  }
  return result;
};
