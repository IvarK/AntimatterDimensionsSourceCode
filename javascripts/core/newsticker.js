"use strict";

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) scrollNextMessage();
}, false);
let scrollTimeouts = [];
let nextMsgIndex;
function scrollNextMessage() {
  // Don't run if hidden to save performance
  if (player.options.newsHidden) return;
  const newsDiv = player.options.newUI ? document.getElementById("newNews") : document.getElementById("news");
  // Select a message at random

  function isUnlocked(index) {
    const message = GameDatabase.news[index];
    return message.condition === undefined || message.condition();
  }
  do {
    nextMsgIndex = Math.floor(Math.random() * GameDatabase.news.length);
  } while (!isUnlocked(nextMsgIndex));

  scrollTimeouts.forEach(clearTimeout);
  scrollTimeouts = [];

  // Set the text
  newsDiv.innerHTML = GameDatabase.news[nextMsgIndex].text;

  // Get the parent width so we can start the message beyond it
  const parentWidth = newsDiv.parentElement.clientWidth;

  // Set the transition to blank so the move happens immediately
  newsDiv.style.transition = "";
  // Move div_text to the right, beyond the edge of the div_container
  newsDiv.style.transform = `translateX(${parentWidth}px)`;

  // We need to use a setTimeout here to allow the browser time to move the div_text before we start the scrolling
  scrollTimeouts.push(setTimeout(() => {
    // Distance to travel is newsDiv.parentElement.clientWidth + newsDiv.clientWidth + parent padding
    // We want to travel at scrollSpeed pixels per second so we need to travel for (distance / scrollSpeed) seconds
    // 20 is div_container padding
    const dist = newsDiv.parentElement.clientWidth + newsDiv.clientWidth + 20;
    // Change this value to change the scroll speed
    const scrollSpeed = 100;
    const transformDuration = dist / scrollSpeed;

    if (!player.options.newsHidden && !player.newsArray.includes(GameDatabase.news[nextMsgIndex].id)) {
        player.newsArray.push(GameDatabase.news[nextMsgIndex].id);
        if (player.newsArray.length >= 50) Achievement(22).unlock();
    }

    // Set the transition duration
    newsDiv.style.transition = `transform ${transformDuration}s linear`;
    // We need to move it to -(width+parent padding) before it won't be visible
    newsDiv.style.transform = `translateX(-${newsDiv.clientWidth + 5}px)`;
    // Automatically start the next message scrolling after this one finishes
    // You could add more time to this timeout if you wanted to have some time between messages
    scrollTimeouts.push(setTimeout(scrollNextMessage, Math.ceil(transformDuration * 1000)));
  }, 100));
}

