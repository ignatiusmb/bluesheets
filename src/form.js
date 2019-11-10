const init = () => {
  for (const form of document.querySelectorAll('form.aqua-form')) {
    for (const input of form.querySelectorAll('input')) {
      const label = document.createElement('label')
      const inputChange = document.createElement('input')
      const placeholder = document.createElement('span')
      for (const attr of input.attributes) {
        inputChange.setAttribute(attr.name, attr.value)
      }

      label.htmlFor = inputChange.type = input.type
      inputChange.placeholder = ' '
      placeholder.textContent = input.placeholder
      placeholder.textContent.charAt(0).toUpperCase()

      label.appendChild(inputChange)
      label.appendChild(placeholder)
      input.replaceWith(label)
    }
  }
}

export { init as default }