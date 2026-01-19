// 日語語音朗讀工具
// 使用瀏覽器內建的 Web Speech API

// 儲存選定的日語語音
let cachedJapaneseVoice = null;
let voiceAvailable = null; // null: 未檢查, true: 可用, false: 不可用

/**
 * 檢查是否有可用的日語語音
 */
export function checkJapaneseVoiceAvailability() {
  if (voiceAvailable !== null) {
    return voiceAvailable;
  }
  
  if (!('speechSynthesis' in window)) {
    voiceAvailable = false;
    return false;
  }
  
  const voices = window.speechSynthesis.getVoices();
  const japaneseVoices = voices.filter(voice => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    
    // 必須是 ja 開頭
    if (!lang.startsWith('ja')) return false;
    
    // 排除任何包含中文相關關鍵字的語音
    const chineseKeywords = ['zh', 'cn', 'tw', 'hk', 'chinese', '中文', '普通话', '國語', '粤语'];
    const hasChinese = chineseKeywords.some(keyword => 
      lang.includes(keyword) || name.includes(keyword)
    );
    
    return !hasChinese;
  });
  
  voiceAvailable = japaneseVoices.length > 0;
  
  if (!voiceAvailable) {
    console.warn('⚠️ 系統中沒有可用的日語語音');
  }
  
  return voiceAvailable;
}

/**
 * 取得純日語語音（排除所有中文語音）
 */
function getJapaneseVoice() {
  const voices = window.speechSynthesis.getVoices();
  
  // 列印所有可用語音（用於調試）
  console.log('所有可用語音:');
  voices.forEach(voice => {
    console.log(`- ${voice.name} (${voice.lang})`);
  });
  
  // 過濾出純日語語音，嚴格排除中文
  const japaneseVoices = voices.filter(voice => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    
    // 必須是 ja 開頭
    if (!lang.startsWith('ja')) return false;
    
    // 排除任何包含中文相關關鍵字的語音
    const chineseKeywords = ['zh', 'cn', 'tw', 'hk', 'chinese', '中文', '普通话', '國語', '粤语'];
    const hasChinese = chineseKeywords.some(keyword => 
      lang.includes(keyword) || name.includes(keyword)
    );
    
    if (hasChinese) return false;
    
    // 確保是日語相關
    const japaneseKeywords = ['ja', 'jp', 'japan', 'japanese', '日本'];
    const hasJapanese = japaneseKeywords.some(keyword => 
      lang.includes(keyword) || name.includes(keyword)
    );
    
    return hasJapanese;
  });
  
  console.log('過濾後的日語語音:');
  japaneseVoices.forEach(voice => {
    console.log(`✓ ${voice.name} (${voice.lang})`);
  });
  
  // 優先順序：
  // 1. ja-JP 且包含 Google 或 Microsoft
  // 2. ja-JP
  // 3. 任何 ja 開頭的
  const preferredVoice = 
    japaneseVoices.find(v => v.lang === 'ja-JP' && (v.name.includes('Google') || v.name.includes('Microsoft'))) ||
    japaneseVoices.find(v => v.lang === 'ja-JP') ||
    japaneseVoices[0];
  
  if (preferredVoice) {
    console.log('✅ 選定日語語音:', preferredVoice.name, preferredVoice.lang);
  } else {
    console.warn('⚠️ 找不到日語語音');
  }
  
  return preferredVoice;
}

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

  // 檢查是否有可用的日語語音
  if (!checkJapaneseVoiceAvailability()) {
    console.warn('沒有可用的日語語音，跳過朗讀');
    return;
  }

  // 取消之前的朗讀
  window.speechSynthesis.cancel();

  // 等待語音列表載入
  const speak = () => {
    // 創建語音實例
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 強制設定語言為日文
    utterance.lang = 'ja-JP';
    
    // 設定語速和音調
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    // 選擇日文語音（重新取得以確保最新）
    const japaneseVoice = getJapaneseVoice();
    
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    } else {
      console.error('❌ 無法找到日語語音，朗讀可能失敗');
      return; // 如果找不到日語語音，就不朗讀
    }

    // 開始朗讀
    window.speechSynthesis.speak(utterance);
  };

  // 如果語音列表為空，等待載入
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    console.log('等待語音列表載入...');
    window.speechSynthesis.onvoiceschanged = () => {
      speak();
    };
  } else {
    speak();
  }
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
 * 取得可用的日文語音列表（排除中文語音）
 */
export function getJapaneseVoices() {
  if (!('speechSynthesis' in window)) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    
    // 必須是 ja 開頭
    if (!lang.startsWith('ja')) return false;
    
    // 排除中文相關
    const chineseKeywords = ['zh', 'cn', 'tw', 'hk', 'chinese', '中文', '普通话', '國語', '粤语'];
    const hasChinese = chineseKeywords.some(keyword => 
      lang.includes(keyword) || name.includes(keyword)
    );
    
    return !hasChinese;
  });
}

/**
 * 初始化語音系統 (載入語音列表)
 * 注意: 某些瀏覽器需要用戶互動後才能載入語音
 */
export function initSpeech(callback) {
  if (!('speechSynthesis' in window)) {
    console.warn('此瀏覽器不支援語音合成功能');
    if (callback) callback(false);
    return;
  }

  // 語音列表載入完成後的回調
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log('📢 語音系統初始化完成，可用語音數:', voices.length);
    
    const hasJapanese = checkJapaneseVoiceAvailability();
    console.log('🇯🇵 日語語音可用:', hasJapanese ? '是' : '否');
    
    if (!hasJapanese) {
      console.error('❌ 警告：系統中沒有日語語音！語音功能將被停用。');
    }
    
    if (callback) {
      callback(hasJapanese);
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
