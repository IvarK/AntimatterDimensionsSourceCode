function fixSave() {
  var save = atob(document.getElementById("brokenSave").value)

  var fixed = save.replace(/NaN/gi, "10")
  var fixed2 = fixed.replace("notyetfixed", "hasbeenfixed")
  var stillToDo = JSON.parse(fixed2)
  
  document.getElementById("fixed").value = btoa(JSON.stringify(stillToDo))
}
