export const clamp = (number, lower, upper) => {
    if (number === number) {
      if (upper !== undefined) {
        number = number <= upper ? number : upper;
      }
      if (lower !== undefined) {
        number = number >= lower ? number : lower;
      }
    }
    return number;
}

export const cvUnit = (val, unit) => {
  let result;
  switch (true) {
      case unit === 'vw':
          result = window.innerWidth * (val / 100);
          break;
      case unit === 'vh':
          result = window.innerHeight * (val / 100);
          break;
      case unit === 'rem':
          result = val / 10 * parseFloat(document.querySelector('html').computedStyleMap().get('font-size').value);
          break;
      default: break;
  }
  return result;
}