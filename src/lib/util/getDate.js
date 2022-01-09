const date = new Date();
date.getFullYear();
date.getMonth() + 1;
date.getDate();
date.getHours();
date.getMinutes();
date.getSeconds();

const today = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
const nowTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
export {
  today, nowTime
}