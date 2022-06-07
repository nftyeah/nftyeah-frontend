const theme = {


}

function setTheme(e) {
  const root = document.body;
  for (let item in theme[e]) {
    root.style.setProperty(item, theme[e][item]);
  }
}

export default setTheme;
