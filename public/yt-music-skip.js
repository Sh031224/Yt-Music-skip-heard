let prevSong = "";
let isSkip = localStorage.getItem("autoSkip") && localStorage.getItem("autoSkip") === "true";

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

const onLoad = () => {
  const labelEl = document.createElement("label");
  labelEl.classList.add("yt_skip_btn");

  const containerEl = document.createElement("div");
  containerEl.classList.add("yt_skip_btn_toggle");

  const inputEl = document.createElement("input");
  inputEl.classList.add("yt_skip_btn_toggle_input");
  inputEl.type = "checkbox";
  inputEl.checked = isSkip;

  const spanEl = document.createElement("div");
  spanEl.classList.add("yt_skip_btn_toggle_entity");

  const textEl = document.createElement("div");
  textEl.classList.add("yt_skip_btn_text");
  textEl.innerText = "Auto Skip";

  containerEl.append(inputEl);
  containerEl.append(spanEl);
  labelEl.append(containerEl);
  labelEl.append(textEl);

  labelEl.addEventListener("click", () => {
    const checked = document.querySelector("input.yt_skip_btn_toggle_input").checked;
    localStorage.setItem("autoSkip", checked);
    isSkip = checked;
  });

  const parentEl = document.querySelector("div.center-content.style-scope.ytmusic-nav-bar");
  parentEl.append(labelEl);
};

const intervalFunc = () => {
  const playListEl = document.querySelector("div#contents.style-scope.ytmusic-player-queue");
  const nowPlay = document.getElementsByClassName("title ytmusic-player-bar");
  const playList = playListEl ? [...playListEl.childNodes] : [];

  removeExpired();

  if (playList) {
    if (nowPlay && nowPlay.length && nowPlay[0].outerText) {
      const song = nowPlay[0].outerText;
      addPlayList(nowPlay[0].outerText);
      if (isSkip && prevSong !== song) playListRemove(nowPlay[0].outerText);
      prevSong = song;
    }
  }
};

setInterval(intervalFunc, 10000);

onLoad();
