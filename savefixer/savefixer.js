function fixSave() {
  var save = atob(document.getElementById("brokenSave").value)

  var fixed = save.replace(/NaN/gi, "10")
  var fixed2 = fixed.replace("notyetfixed", "hasbeenfixed")
  var stillToDo = JSON.parse(fixed2)
  for (var i=0; i<stillToDo.autobuyers.length; i++) stillToDo.autobuyers[i].isOn = false
  
  document.getElementById("fixed").value = btoa(JSON.stringify(stillToDo))
}