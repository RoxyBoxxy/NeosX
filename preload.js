const path = require('path');
const url = require('url');
const { Titlebar, Color } = require('custom-electron-titlebar') 
const customTitlebar = require('custom-electron-titlebar');
let titlebar = require('custom-electron-titlebar');
window.addEventListener('DOMContentLoaded', () => {


    new Titlebar({
        backgroundColor: Color.fromHex('#ECECEC')
    });

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
