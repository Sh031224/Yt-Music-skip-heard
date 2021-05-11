let prevSong = "";
let prevIsSkip = localStorage.getItem("autoSkip") && localStorage.getItem("autoSkip") === "true";
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

      if (
        selectedEl[2].children[0].innerText === removedItems[i].name &&
        song !== removedItems[i].name &&
        playingIdx < j
      ) {
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
            if (document.querySelectorAll("ytmusic-menu-service-item-renderer")[2]) {
              document.querySelectorAll("ytmusic-menu-service-item-renderer")[2].click();
            }

            resolve();
            // const popup = document.querySelectorAll(".ytmusic-menu-popup-renderer");
            // for (let i = 0; i < popup.length; i++) {
            //   console.log(
            //     popup[i].querySelector(
            //       "path[d=M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z]"
            //     )
            //   );
            //   if (popup.item(i).querySelector("yt-formatted-string").innerText.includes("삭제")) {
            //     document.querySelectorAll(".ytmusic-menu-popup-renderer").item(i).click();
            //     resolve();
            //     break;
            //   }
            // }
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
    prevIsSkip = isSkip;
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
      if ((!prevIsSkip && isSkip) || (isSkip && prevSong !== song)) {
        prevIsSkip = isSkip;
        playListRemove(nowPlay[0].outerText);
      }
      prevSong = song;
    }
  }
};

setInterval(intervalFunc, 10000);

onLoad();
