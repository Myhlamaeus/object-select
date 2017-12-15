export function contains(ele, parent, str) {
  return String(ele).indexOf(String(str)) !== -1;
}

export function val(ele, parent, val) {
  return ele === val;
}

export function valCoerced(ele, parent, val) {
  return ele === val;
}
