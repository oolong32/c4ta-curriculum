function getAllDescriptions() {
  description = document.querySelectorAll('.description') 
}
function listenAllDescriptions() {
  description.forEach(item => {
    if (!item.dataset.listening) { // is element marked/listening?
      item.addEventListener('input', checkDescriptionLength)
      // mark element as listening
      item.dataset.listening = true
    }
  })
}
function checkDescriptionLength() {
  const descriptionCopy = Array.from(description)
  if (descriptionCopy.filter(item => item.value === "").length === 0) {
    const newInput = document.createElement("input")
    newInput.type = 'text'
    newInput.name = 'description[]'
    newInput.id = `description-${description.length}`
    newInput.className = 'description'
    description[description.length-1].insertAdjacentElement('afterend', newInput)
  }
  // update node list
  getAllDescriptions()
  // add event listener to new item
  listenAllDescriptions()
  }

let description 
getAllDescriptions()
listenAllDescriptions() // could be added directly to new input, but whatevs