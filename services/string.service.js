/**
 * Calculating the string distance between two strings
 */

const editDistance = (longerString, shorterString) => {
  longerString = longerString.toLowerCase();
  shorterString = shorterString.toLowerCase();

  let costs = [];

  for (let itr = 0; itr <= longerString.length; itr++) {
    let lastValue = itr;

    for (let jtr = 0; jtr <= shorterString.length; jtr++) {
      if (itr == 0) { costs[jtr] = itr; }
      else {
        if (jtr > 0) {
          let newValue = costs[jtr - 1];
          if (longerString.charAt(itr - 1) !== shorterString.charAt(jtr - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[jtr]) + 1;
          }
          costs[jtr - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (itr > 0) {
      costs[shorterString.length] = lastValue;
    }
  }
  return costs[shorterString.length];
}


module.exports = {
  similarity: (string1, string2) => {
    let longer = (string1.length > string2.length) ? string1 : string2,
      shorter = (string2.length >= string1.length) ? string1 : string2,
      longerLength = longer.length;
    
    if (longerLength === 0) { return 1.0; }
    return ((longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)); 
  }
}


