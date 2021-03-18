let prevSong = "";

const addPlayList = (name) => {
  let lists = JSON.parse(localStorage.getItem("playList") || null) || [];
  const item = { name, expired: new Date(new Date().getTime() + 120 * 60000) };

  if (lists && Array.isArray(lists)) {
    if (!lists.find((item) => item.name === name)) {
      lists.push(item);
    }
  } else {
    lists = [item];
  }

  localStorage.setItem("playList", JSON.stringify(lists));
};

const removeExpired = () => {
  const lists = JSON.parse(localStorage.getItem("playList") || null) || [];

  if (lists && Array.isArray(lists)) {
    lists.map((item, idx) => {
      if (item.expired && new Date() > new Date(item.expired)) {
        lists.splice(idx, 1);
      }
    });

    localStorage.setItem("playList", JSON.stringify(lists));
  }
};

const playListRemove = async (song) => {
  removeExpired();
  const removedItems = JSON.parse(localStorage.getItem("playList") || null) || [];
  let playingIdx = 0;

  const checkListEl = document.querySelector("div#contents.style-scope.ytmusic-player-queue");
  const checkList = checkListEl ? checkListEl.childNodes : null;

  for (let i = 0; i < checkList.length; i++) {
    if (song === checkList[i].children[2].children[0].innerText) {
      playingIdx = i;
      break;
    }
  }

  for (let i = 0; i < removedItems.length; i++) {
    const playListEl = document.querySelector("div#contents.style-scope.ytmusic-player-queue");
    const list = playListEl ? playListEl.childNodes : null;
    let selectedIdx;
    let selectedEl;
    let selectedName = "";

    for (let j = 0; j < list.length; j++) {
      selectedEl = list[j].children;

      if (selectedEl[2].children[0].innerText === removedItems[i].name && song !== removedItems[i].name && playingIdx < j) {
        selectedName = removedItems[i].name;
        selectedIdx = j;
        break;
      }
    }

    if (selectedIdx !== 0 && selectedIdx && selectedEl) {
      const firstStep = () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            selectedEl.item(3).children.item(1).click();
            resolve();
          }, 100);
        });

      const secondStep = () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            document.querySelectorAll(".ytmusic-menu-popup-renderer").item(7).click();
            resolve();
          }, 10);
        });

      const allSteps = async () => {
        await firstStep();
        await secondStep();
      };

      await allSteps();
      console.log(`Removed: ${selectedName}`);
    }
  }
};

setInterval(() => {
  const playListEl = document.querySelector("div#contents.style-scope.ytmusic-player-queue");
  const nowPlay = document.getElementsByClassName("title ytmusic-player-bar");
  const playList = playListEl ? [...playListEl.childNodes] : [];

  removeExpired();

  if (playList) {
    if (nowPlay && nowPlay.length && nowPlay[0].outerText) {
      const song = nowPlay[0].outerText;
      addPlayList(nowPlay[0].outerText);
      if (prevSong !== song) playListRemove(nowPlay[0].outerText);
      prevSong = song;
    }
  }
}, 10000);
