export function readOnly(ele, parent) {
  if (typeof ele === 'object') {
    return Object.isFrozen(ele);
  }

  return Object.isFrozen(parent);
}

export function readWrite(ele, parent) {
  return !readOnly(ele, parent);
}
