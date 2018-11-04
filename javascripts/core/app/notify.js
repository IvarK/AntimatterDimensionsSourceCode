ui.notify = function() {
  const container = document.getElementById("notification-container");
  const template = document.createElement('div');
  template.classList.add("o-notification");
  function showNotification(text, elClass) {
    const el = template.cloneNode();
    el.classList.add(elClass);
    el.textContent = text;
    container.appendChild(el);
    el.onclick = () => {
      el.onclick = undefined;
      el.style["animation-name"] = "o-notification--hide";
    };
    setTimeout(() => el.remove(), 2500);
  }
  return {
    success: (text) => showNotification(text, "o-notification--success"),
    error: (text) => showNotification(text, "o-notification--error"),
    info: (text) => showNotification(text, "o-notification--info")
  };
}();