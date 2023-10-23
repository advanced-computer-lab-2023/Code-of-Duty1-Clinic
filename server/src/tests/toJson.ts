function toJson(x: any) {
  return JSON.stringify(x);
}

const obj = { name: 'f' };

console.log(toJson(obj));
