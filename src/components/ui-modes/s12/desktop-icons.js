export default {
  entries: [{
    name: "Windows Media Player",
    action() {
      const links = [
        // Get trolled
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        // Rite of spring
        "https://youtu.be/rP42C-4zL3w?t=2",
        // Aleph 0 which for some reason caught on for a while
        "https://www.youtube.com/watch?v=fTaWKbD3UK8",
        // "If you have not listened to first suite in E flat by Gustav Holst do it now" -Erf
        "https://www.youtube.com/watch?v=fLbP6qpI1YI",
      ];
      window.open(links[Math.floor(Math.random() * links.length)]);
    },
    image: "desktop--windows-media-player.png"
  },
  {
    name: "Discord",
    action() {
      window.open("https://discord.gg/ST9NaXa");
    },
    image: "desktop--discord-logo.png"
  },
  {
    name: "Games",
    action() {
      Modal.s12Games.show();
    },
    image: "desktop--games.png"
  }],
  selected: -1,
};
