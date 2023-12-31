async function csvBuilder(item) {
  let itemValues = Object.values(item).map(parseValue).join(",");

  return itemValues;
  
}

function parseValue(value) {
  if (!value) {
    return '---';
  }

  const number = Number(value);
  if (!Number.isNaN(number)) {
    return number.toString();
  }

  if (typeof value === "object") {
    if (value.length > 0) {
      return value.join(";")

    }
  }

  return value
}

module.exports = {csvBuilder};

