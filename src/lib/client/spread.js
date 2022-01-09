export const createSpreadData = (data) => {
  const sheetOptions = {};
  const columns = Object.keys(data[0]).map((key) => {
    return { type: "text", title: key, width: 90 };
  });
  sheetOptions.data = data;
  // sheetOptions.pagination = 100;
  sheetOptions.columns = columns;
  return sheetOptions
};
