// Pure: tagged template literal helper for syntax highlighting
// Takes template strings and values, returns concatenated HTML string
function html (strings, ...values) {
  var result = ''
  for (var i = 0; i < strings.length; i++) {
    result += strings[i]
    if (i < values.length) {
      result += values[i]
    }
  }
  return result
}

export default html
