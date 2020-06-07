function isNonNegativeInteger(number) {
  let rule = /^\d+$/;
  if(!rule.test(number)){
    return false;
  } else {
    return true;
  }
}
