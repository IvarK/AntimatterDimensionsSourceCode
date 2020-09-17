"use strict";

GameUI.notify = (function() {
  const template = document.createElement("div");
  template.classList.add("o-notification");
  const enterAnimation = "a-notification--enter";
  const leaveAnimation = "a-notification--leave";
  function showNotification(text, elClass) {
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
    setTimeout(() => leave(), 2000);
    el.onclick = () => leave();
  }
  return {
    success: text => showNotification(text, "o-notification--success"),
    error: text => showNotification(text, "o-notification--error"),
    info: text => showNotification(text, "o-notification--info"),
    reality: text => showNotification(text, "o-notification--reality"),
    blackHole: text => showNotification(text, "o-notification--black-hole"),
    memory: (text, petName) => showNotification(text, `o-notification--memory-${petName.toLowerCase()}`),
    showBlackHoles: true
  };
}());