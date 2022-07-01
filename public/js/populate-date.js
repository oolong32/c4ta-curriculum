  // populate date field 
  // https://stackoverflow.com/questions/28729634/set-values-in-input-type-date-and-time-in-javascript
  // https://www.w3docs.com/snippets/javascript/how-to-convert-a-string-into-a-date-in-javascript.html
  const dateField = document.querySelector('#date')
  const date = new Date(dateField.dataset.date)
  dateField.valueAsDate = date