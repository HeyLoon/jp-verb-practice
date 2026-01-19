// 羅馬拼音轉平假名工具
// 支援常見的羅馬拼音輸入法 (類似 WanaKana)

const ROMAJI_TO_HIRAGANA = {
  // 基本五十音
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  'sa': 'さ', 'si': 'し', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  'za': 'ざ', 'zi': 'じ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  'ta': 'た', 'ti': 'ち', 'chi': 'ち', 'tu': 'つ', 'tsu': 'つ', 'te': 'て', 'to': 'と',
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  'ha': 'は', 'hi': 'ひ', 'hu': 'ふ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  'wa': 'わ', 'wi': 'ゐ', 'we': 'ゑ', 'wo': 'を', 'n': 'ん',
  
  // 拗音 (きゃ、きゅ、きょ 等)
  'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
  'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
  'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
  'sya': 'しゃ', 'syu': 'しゅ', 'syo': 'しょ',
  'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ',
  'jya': 'じゃ', 'jyu': 'じゅ', 'jyo': 'じょ',
  'zya': 'じゃ', 'zyu': 'じゅ', 'zyo': 'じょ',
  'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
  'tya': 'ちゃ', 'tyu': 'ちゅ', 'tyo': 'ちょ',
  'dya': 'ぢゃ', 'dyu': 'ぢゅ', 'dyo': 'ぢょ',
  'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
  'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
  'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
  'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
  'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
  'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
  
  // 特殊組合
  'lla': 'っら', 'lwa': 'っわ', 'lya': 'っや',
  'ltu': 'っ', 'ltsu': 'っ', 'xtu': 'っ', 'xtsu': 'っ',
  'lya': 'ゃ', 'lyu': 'ゅ', 'lyo': 'ょ',
  'xya': 'ゃ', 'xyu': 'ゅ', 'xyo': 'ょ',
  'la': 'ぁ', 'li': 'ぃ', 'lu': 'ぅ', 'le': 'ぇ', 'lo': 'ぉ',
  'xa': 'ぁ', 'xi': 'ぃ', 'xu': 'ぅ', 'xe': 'ぇ', 'xo': 'ぉ',
  
  // 長音記號和其他
  '-': 'ー',
};

/**
 * 將羅馬拼音轉換為平假名
 * @param {string} romaji - 羅馬拼音字符串
 * @returns {string} - 平假名字符串
 */
export function romajiToHiragana(romaji) {
  if (!romaji) return '';
  
  let result = '';
  let text = romaji.toLowerCase();
  let i = 0;
  
  while (i < text.length) {
    // 跳過空格
    if (text[i] === ' ') {
      result += ' ';
      i++;
      continue;
    }
    
    // 處理促音 (雙子音 -> っ)
    if (i < text.length - 1 && 
        text[i] === text[i + 1] && 
        'kgsztdhbpmyrw'.includes(text[i])) {
      result += 'っ';
      i++;
      continue;
    }
    
    // 處理 n' -> ん (n 在子音前或結尾)
    if (text[i] === 'n') {
      // 如果是最後一個字符
      if (i === text.length - 1) {
        result += 'ん';
        i++;
        continue;
      }
      // 如果後面跟著 ' 或子音(非 yaeiou)
      if (text[i + 1] === "'" || 
          (i < text.length - 1 && !'yaeiou'.includes(text[i + 1]))) {
        result += 'ん';
        i++;
        if (text[i] === "'") i++; // 跳過 '
        continue;
      }
    }
    
    // 嘗試匹配最長的羅馬拼音
    let matched = false;
    
    // 先嘗試 3 個字符
    if (i <= text.length - 3) {
      const three = text.substring(i, i + 3);
      if (ROMAJI_TO_HIRAGANA[three]) {
        result += ROMAJI_TO_HIRAGANA[three];
        i += 3;
        matched = true;
      }
    }
    
    // 然後嘗試 2 個字符
    if (!matched && i <= text.length - 2) {
      const two = text.substring(i, i + 2);
      if (ROMAJI_TO_HIRAGANA[two]) {
        result += ROMAJI_TO_HIRAGANA[two];
        i += 2;
        matched = true;
      }
    }
    
    // 最後嘗試 1 個字符
    if (!matched) {
      const one = text[i];
      if (ROMAJI_TO_HIRAGANA[one]) {
        result += ROMAJI_TO_HIRAGANA[one];
        i++;
        matched = true;
      }
    }
    
    // 如果都沒匹配到,保留原字符
    if (!matched) {
      result += text[i];
      i++;
    }
  }
  
  return result;
}

/**
 * 檢查字符串是否包含平假名
 */
export function containsHiragana(str) {
  return /[\u3040-\u309F]/.test(str);
}

/**
 * 檢查字符串是否全部是平假名
 */
export function isAllHiragana(str) {
  return /^[\u3040-\u309F]+$/.test(str);
}

/**
 * 檢查字符串是否包含片假名
 */
export function containsKatakana(str) {
  return /[\u30A0-\u30FF]/.test(str);
}

/**
 * 檢查字符串是否包含漢字
 */
export function containsKanji(str) {
  return /[\u4E00-\u9FAF]/.test(str);
}

/**
 * 檢查字符串是否包含日文字符
 */
export function containsJapanese(str) {
  return containsHiragana(str) || containsKatakana(str) || containsKanji(str);
}

export default {
  romajiToHiragana,
  containsHiragana,
  isAllHiragana,
  containsKatakana,
  containsKanji,
  containsJapanese
};
