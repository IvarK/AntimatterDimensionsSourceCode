export default {
  isDisplaying: false,
  displayForce(name, duration) {
    document.getElementById("ui").style.animation = `${name} ${duration}s 1`;
    document.getElementById("ui-fixed").style.animation = `${name} ${duration}s 1`;
    this.isDisplaying = true;
    setTimeout(() => {
      document.getElementById("ui").style.animation = "";
      document.getElementById("ui-fixed").style.animation = "";
      this.isDisplaying = false;
    }, duration * 1000);
  },
  display(name, duration) {
    if (!this.isDisplaying) {
      this.displayForce(name, duration);
    }
  }
};