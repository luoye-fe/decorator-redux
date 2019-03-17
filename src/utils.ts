export function objForEach(obj: any, callback: Function) {
  Object.keys(obj).forEach(key => callback(obj[key], key));
}

export function chainDefine(map: any, path: Array<string>, value: object) {
  if (path.length === 1) return map[path[0]] = value;

  chainDefine(map[path[0]], path.slice(1), value);
}

export function assert(msg: string) {
  return console.log(`%c[decorator-redux]`, 'background: #ff5151; color: #fff', `${msg}`);
}
