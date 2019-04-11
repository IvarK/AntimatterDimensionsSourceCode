function fixSave() {
  const save = atob(document.getElementById("brokenSave").value);

  const fixed = save.replace(/NaN/gi, "10");
  const fixed2 = fixed.replace("notyetfixed", "hasbeenfixed");
  const stillToDo = JSON.parse(fixed2);
  for (let i = 0; i < stillToDo.autobuyers.length; i++) stillToDo.autobuyers[i].isOn = false;
  
  document.getElementById("fixed").value = btoa(JSON.stringify(stillToDo));
}