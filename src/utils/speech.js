// 日語語音朗讀工具
// 使用瀏覽器內建的 Web Speech API

/**
 * 朗讀日文文字
 * @param {string} text - 要朗讀的日文文字
 * @param {number} rate - 語速 (0.1 - 10, 預設 1.0)
 * @param {number} pitch - 音調 (0 - 2, 預設 1.0)
 */
export function speakJapanese(text, rate = 1.0, pitch = 1.0) {
  // 檢查瀏覽器是否支援
  if (!('speechSynthesis' in window)) {
    console.warn('此瀏覽器不支援語音合成功能');
    return;
  }

  // 取消之前的朗讀
  window.speechSynthesis.cancel();

  // 創建語音實例
  const utterance = new SpeechSynthesisUtterance(text);
  
  // 設定語言為日文
  utterance.lang = 'ja-JP';
  
  // 設定語速和音調
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1.0;

  // 嘗試選擇日文語音
  const voices = window.speechSynthesis.getVoices();
  const japaneseVoice = voices.find(voice => voice.lang.startsWith('ja'));
  
  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  // 開始朗讀
  window.speechSynthesis.speak(utterance);
}

/**
 * 停止朗讀
 */
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 暫停朗讀
 */
export function pauseSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

/**
 * 繼續朗讀
 */
export function resumeSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

/**
 * 檢查是否正在朗讀
 */
export function isSpeaking() {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

/**
 * 取得可用的日文語音列表
 */
export function getJapaneseVoices() {
  if (!('speechSynthesis' in window)) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => voice.lang.startsWith('ja'));
}

/**
 * 初始化語音系統 (載入語音列表)
 * 注意: 某些瀏覽器需要用戶互動後才能載入語音
 */
export function initSpeech(callback) {
  if (!('speechSynthesis' in window)) {
    console.warn('此瀏覽器不支援語音合成功能');
    return;
  }

  // 語音列表載入完成後的回調
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (callback && voices.length > 0) {
      callback(voices);
    }
  };

  // Chrome 需要監聽 onvoiceschanged 事件
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // 立即嘗試載入 (某些瀏覽器可以直接取得)
  loadVoices();
}

/**
 * 朗讀動詞變化 (辭書形 -> 變化形)
 * @param {string} dictionaryForm - 辭書形
 * @param {string} conjugatedForm - 變化後的形式
 */
export function speakVerbConjugation(dictionaryForm, conjugatedForm) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  // 先讀辭書形
  speakJapanese(dictionaryForm, 0.9);

  // 等待一下再讀變化形
  setTimeout(() => {
    speakJapanese(conjugatedForm, 0.9);
  }, 1200);
}

export default {
  speakJapanese,
  stopSpeaking,
  pauseSpeaking,
  resumeSpeaking,
  isSpeaking,
  getJapaneseVoices,
  initSpeech,
  speakVerbConjugation
};
