let prevSong = '';
let isSkip = localStorage.getItem('autoSkip') && localStorage.getItem('autoSkip') === 'true';
let prevIsSkip = isSkip;

const onLoad = () => {
  const labelEl = document.createElement('label');
  labelEl.classList.add('yt_skip_btn');

  const containerEl = document.createElement('div');
  containerEl.classList.add('yt_skip_btn_toggle');

  const inputEl = document.createElement('input');
  inputEl.classList.add('yt_skip_btn_toggle_input');
  inputEl.type = 'checkbox';
  inputEl.checked = isSkip;

  const spanEl = document.createElement('div');
  spanEl.classList.add('yt_skip_btn_toggle_entity');

  const textEl = document.createElement('div');
  textEl.classList.add('yt_skip_btn_text');
  textEl.innerText = 'Auto Skip';

  containerEl.append(inputEl);
  containerEl.append(spanEl);
  labelEl.append(containerEl);
  labelEl.append(textEl);

  labelEl.addEventListener('click', () => {
    const checked = document.querySelector('input.yt_skip_btn_toggle_input').checked;
    localStorage.setItem('autoSkip', checked);
    prevIsSkip = isSkip;
    isSkip = checked;
  });

  const parentEl = document.querySelector('div.center-content.style-scope.ytmusic-nav-bar');
  parentEl.append(labelEl);
};

const interval = () => {
  const playListEl = document.querySelector('div#contents.style-scope.ytmusic-player-queue');
  const nowPlay = document.getElementsByClassName('title ytmusic-player-bar');
  const playList = playListEl ? [...playListEl.childNodes] : [];

  cleanup();

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

setInterval(interval, 10000);

onLoad();

const addPlayList = (name) => {
  let lists = JSON.parse(localStorage.getItem('playList') || null) || [];
  const item = { name, expired: new Date(new Date().getTime() + 120 * 60000) };

  if (lists && Array.isArray(lists)) {
    if (!lists.find((item) => item.name === name)) {
      lists.push(item);
    }
  } else {
    lists = [item];
  }

  localStorage.setItem('playList', JSON.stringify(lists));
};

const getSoneNameByNode = (node) =>
  node.querySelector('yt-formatted-string.song-title').textContent;

const getSongName = (index) => {
  const queue = document.querySelectorAll('ytmusic-player-queue-item.ytmusic-player-queue');

  return getSoneNameByNode(queue.item(index));
};

const playListRemove = async (currentSong) => {
  cleanup();
  const shouldRemoveItems = JSON.parse(localStorage.getItem('playList') || null) || [];
  let playingIdx = -1;

  const queue = [...document.querySelectorAll('ytmusic-player-queue-item.ytmusic-player-queue')];

  for (let i = 0; i < queue.length; i++) {
    const songName = getSongName(i);

    if (currentSong === songName) {
      playingIdx = i;
      break;
    }
  }

  if (playingIdx === -1) {
    return;
  }

  for (let i = 0; i < shouldRemoveItems.length; i++) {
    const targetIndex = queue.findIndex(
      (node) => getSoneNameByNode(node) === shouldRemoveItems[i].name
    );

    if (targetIndex === -1 || playingIdx >= targetIndex) {
      continue;
    }

    const act = () =>
      new Promise((res) => {
        setTimeout(() => {
          const menu = queue[targetIndex].querySelector('ytmusic-menu-renderer');
          const trigger = menu.querySelector('yt-button-shape yt-touch-feedback-shape');

          trigger.click();

          setTimeout(() => {
            const removeFromQueue = document
              .querySelectorAll(
                'ytmusic-popup-container ytmusic-menu-popup-renderer tp-yt-paper-listbox ytmusic-menu-service-item-renderer'
              )
              .item(2);
            removeFromQueue.click();
            res();
          }, 10);
        }, 100);
      });

    await act();
    console.log(`Removed: ${getSoneNameByNode(queue.at(targetIndex))}`);
  }
};

const cleanup = () => {
  const lists = JSON.parse(localStorage.getItem('playList') || null) || [];

  if (lists && Array.isArray(lists)) {
    lists.map((item, idx) => {
      if (item.expired && new Date() > new Date(item.expired)) {
        lists.splice(idx, 1);
      }
    });

    localStorage.setItem('playList', JSON.stringify(lists));
  }
};
