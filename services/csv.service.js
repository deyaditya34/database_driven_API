function writeCsvItems(items, outStream) {
  items.forEach((item) => {
    outStream.write(`${buildRowFromItem(item)}\n`);
  });
}

function writeCsvHeader(header, outStream) {
  outStream.write(`${header.join(",")}\n`);
}

function buildRowFromItem(item) {
  return Object.values(item).join(",");
}

function writeCsvItemsForCursor(item, outStream) {
  outStream.write(`${buildRowFromItem(item)}\n`);
}

module.exports = {
  writeCsvHeader,
  writeCsvItems,
  writeCsvItemsForCursor,
};
