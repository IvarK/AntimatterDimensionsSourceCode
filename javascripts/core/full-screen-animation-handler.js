export default {
  isDisplaying: false,
  displayForce(name, duration) {
    document.body.style.animation = `${name} ${duration}s 1`;
    this.isDisplaying = true;
    setTimeout(() => {
      document.body.style.animation = "";
      this.isDisplaying = false;
    }, duration * 1000);
  },
  display(name, duration) {
    if (!this.isDisplaying) {
      this.displayForce(name, duration);
    }
  }
};