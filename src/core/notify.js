export const notify = (function() {
  const template = document.createElement("div");
  template.classList.add("o-notification");
  const enterAnimation = "a-notification--enter";
  const leaveAnimation = "a-notification--leave";
  function showNotification(text, elClass, duration = 2000) {
    if (!GameUI.initialized) {
      setTimeout(showNotification, 500, text, elClass, duration);
      return;
    }
    const el = template.cloneNode();
    el.textContent = text;
    el.classList.add(elClass, enterAnimation);
    const container = document.getElementById("notification-container");
    container.appendChild(el);
    let entered = false;
    function stopEnter() {
      if (entered) return;
      entered = true;
      el.classList.remove(enterAnimation);
    }
    setTimeout(() => stopEnter(), 500);
    let leaving = false;
    function leave() {
      if (leaving) return;
      leaving = true;
      stopEnter();
      el.classList.add(leaveAnimation);
      setTimeout(() => el.remove(), 500);
    }
    setTimeout(() => leave(), duration);
    el.onclick = () => leave();
  }
  return {
    success: (text, duration) => showNotification(text, "o-notification--success", duration),
    error: (text, duration) => showNotification(text, "o-notification--error", duration),
    info: (text, duration) => showNotification(text, "o-notification--info", duration),
    infinity: (text, duration) => showNotification(text, "o-notification--infinity", duration),
    eternity: (text, duration) => showNotification(text, "o-notification--eternity", duration),
    reality: (text, duration) => showNotification(text, "o-notification--reality", duration),
    automator: (text, duration) => showNotification(text, "o-notification--automator", duration),
    blackHole: (text, duration) => showNotification(text, "o-notification--black-hole", duration),
    strike: (text, duration) => showNotification(text, "o-notification--strike", duration),
    showBlackHoles: true
  };
}());
