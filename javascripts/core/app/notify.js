ui.notify = function() {
  const container = document.getElementById("notification-container");
  const template = document.createElement('div');
  template.classList.add("c-notification");
  function showNotification(text, elClass) {
    const el = template.cloneNode();
    el.classList.add(elClass);
    el.textContent = text;
    container.appendChild(el);
    el.onclick = () => {
      el.onclick = undefined;
      el.style["animation-name"] = "c-notification--hide";
    };
    setTimeout(() => el.remove(), 2500);
  }
  return {
    success: (text) => showNotification(text, "c-notification--success"),
    error: (text) => showNotification(text, "c-notification--error"),
    info: (text) => showNotification(text, "c-notification--info")
  };
}();