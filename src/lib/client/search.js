export const fetchData = async (word, condition) => {
  console.log(word);
  console.log(condition);
  if (word === "") return;
  const results = await window.myapi.getData(word, condition);
  return results
};