// 日語動詞變化引擎 - 正交系統 (Orthogonal System)
// 三層架構: Voice (態) -> Mode (模式) -> Modifiers (修飾詞)

/**
 * Layer A: Voice (動詞的態 - The Base)
 */
export const VOICES = {
  DICTIONARY: 'dictionary',           // 基本形
  POTENTIAL: 'potential',             // 可能形
  PASSIVE: 'passive',                 // 受身形
  CAUSATIVE: 'causative',             // 使役形
  CAUSATIVE_PASSIVE: 'causativePassive', // 使役受身形
};

export const VOICE_NAMES = {
  [VOICES.DICTIONARY]: '基本形',
  [VOICES.POTENTIAL]: '可能形',
  [VOICES.PASSIVE]: '受身形',
  [VOICES.CAUSATIVE]: '使役形',
  [VOICES.CAUSATIVE_PASSIVE]: '使役受身形',
};

/**
 * Layer B: Mode (動詞的模式 - The Ending Type)
 */
export const MODES = {
  STANDARD: 'standard',       // 標準形 (允許所有修飾詞)
  TE_FORM: 'te',             // て形 (只允許否定)
  VOLITIONAL: 'volitional',  // 意向形 (只允許丁寧)
  IMPERATIVE: 'imperative',  // 命令形 (不允許任何修飾詞)
};

export const MODE_NAMES = {
  [MODES.STANDARD]: '標準形',
  [MODES.TE_FORM]: 'て形',
  [MODES.VOLITIONAL]: '意向形',
  [MODES.IMPERATIVE]: '命令形',
};

/**
 * Layer C: Modifiers (修飾詞 - The Switches)
 */
export const MODIFIERS = {
  POLITE: 'polite',       // 丁寧 (です・ます)
  NEGATIVE: 'negative',   // 否定 (ない)
  PAST: 'past',          // 過去 (た)
};

export const MODIFIER_NAMES = {
  [MODIFIERS.POLITE]: '丁寧',
  [MODIFIERS.NEGATIVE]: '否定',
  [MODIFIERS.PAST]: '過去',
};

/**
 * 定義每個 Mode 允許的 Modifiers
 */
export const MODE_ALLOWED_MODIFIERS = {
  [MODES.STANDARD]: [MODIFIERS.POLITE, MODIFIERS.NEGATIVE, MODIFIERS.PAST],
  [MODES.TE_FORM]: [MODIFIERS.NEGATIVE],  // て形只允許否定 (なくて/ないで)
  [MODES.VOLITIONAL]: [MODIFIERS.POLITE], // 意向形只允許丁寧 (ましょう)
  [MODES.IMPERATIVE]: [],                  // 命令形不允許任何修飾詞
};

// ==================== 輔助函數 ====================

/**
 * 五段動詞的音便規則 (た形和て形)
 */
function getGodanTaTeForm(verb, isTeForm = false) {
  const lastChar = verb.charAt(verb.length - 1);
  const stem = verb.slice(0, -1);
  const suffix = isTeForm ? 'て' : 'た';
  const negSuffix = isTeForm ? 'で' : 'だ';
  
  // う、つ、る → った/って
  if ('うつる'.includes(lastChar)) {
    return stem + 'っ' + suffix;
  }
  // ぬ、ぶ、む → んだ/んで
  if ('ぬぶむ'.includes(lastChar)) {
    return stem + 'ん' + negSuffix;
  }
  // く → いた/いて (特殊:行く → 行った)
  if (lastChar === 'く') {
    if (verb === '行く') {
      return '行っ' + suffix;
    }
    return stem + 'い' + suffix;
  }
  // ぐ → いだ/いで
  if (lastChar === 'ぐ') {
    return stem + 'い' + negSuffix;
  }
  // す → した/して
  if (lastChar === 'す') {
    return stem + 'し' + suffix;
  }
  
  return verb + suffix;
}

/**
 * 五段動詞的 a 段變化 (用於否定形、使役形等)
 */
function getGodanARow(verb) {
  const lastChar = verb.charAt(verb.length - 1);
  const stem = verb.slice(0, -1);
  
  const uToA = {
    'う': 'わ', 'く': 'か', 'ぐ': 'が', 'す': 'さ',
    'つ': 'た', 'ぬ': 'な', 'ぶ': 'ば', 'む': 'ま', 'る': 'ら'
  };
  
  return stem + (uToA[lastChar] || 'a');
}

/**
 * 五段動詞的 e 段變化 (用於可能形、命令形等)
 */
function getGodanERow(verb) {
  const lastChar = verb.charAt(verb.length - 1);
  const stem = verb.slice(0, -1);
  
  const uToE = {
    'う': 'え', 'く': 'け', 'ぐ': 'げ', 'す': 'せ',
    'つ': 'て', 'ぬ': 'ね', 'ぶ': 'べ', 'む': 'め', 'る': 'れ'
  };
  
  return stem + (uToE[lastChar] || 'e');
}

/**
 * 五段動詞的 i 段變化 (用於ます形)
 */
function getGodanIRow(verb) {
  const lastChar = verb.charAt(verb.length - 1);
  const stem = verb.slice(0, -1);
  
  const uToI = {
    'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し',
    'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び', 'む': 'み', 'る': 'り'
  };
  
  return stem + (uToI[lastChar] || 'i');
}

/**
 * 五段動詞的 o 段變化 (用於意志形)
 */
function getGodanORow(verb) {
  const lastChar = verb.charAt(verb.length - 1);
  const stem = verb.slice(0, -1);
  
  const uToO = {
    'う': 'お', 'く': 'こ', 'ぐ': 'ご', 'す': 'そ',
    'つ': 'と', 'ぬ': 'の', 'ぶ': 'ぼ', 'む': 'も', 'る': 'ろ'
  };
  
  return stem + (uToO[lastChar] || 'o');
}

/**
 * 取得 SURU 動詞的詞幹 (去掉する)
 */
function getSuruStem(verb) {
  return verb.slice(0, -2);
}

// ==================== 核心變化函數 ====================

/**
 * Step 1: 將辭書形轉換為指定的 Voice (態)
 */
function transformToVoice(baseVerb, verbType, voice) {
  // 如果是基本形，直接返回
  if (voice === VOICES.DICTIONARY) {
    return baseVerb;
  }

  // SURU 動詞特殊處理
  if (verbType === 'SURU') {
    const stem = getSuruStem(baseVerb);
    if (voice === VOICES.POTENTIAL) return stem + 'できる';
    if (voice === VOICES.PASSIVE) return stem + 'される';
    if (voice === VOICES.CAUSATIVE) return stem + 'させる';
    if (voice === VOICES.CAUSATIVE_PASSIVE) return stem + 'させられる';
  }

  // 一段動詞
  if (verbType === 'ICHIDAN') {
    const stem = baseVerb.slice(0, -1);
    if (voice === VOICES.POTENTIAL) return stem + 'られる';
    if (voice === VOICES.PASSIVE) return stem + 'られる';
    if (voice === VOICES.CAUSATIVE) return stem + 'させる';
    if (voice === VOICES.CAUSATIVE_PASSIVE) return stem + 'させられる';
  }

  // 五段動詞
  if (verbType === 'GODAN') {
    if (voice === VOICES.POTENTIAL) return getGodanERow(baseVerb) + 'る';
    if (voice === VOICES.PASSIVE) return getGodanARow(baseVerb) + 'れる';
    if (voice === VOICES.CAUSATIVE) return getGodanARow(baseVerb) + 'せる';
    if (voice === VOICES.CAUSATIVE_PASSIVE) return getGodanARow(baseVerb) + 'せられる';
  }

  // 不規則動詞
  if (baseVerb === 'する') {
    if (voice === VOICES.POTENTIAL) return 'できる';
    if (voice === VOICES.PASSIVE) return 'される';
    if (voice === VOICES.CAUSATIVE) return 'させる';
    if (voice === VOICES.CAUSATIVE_PASSIVE) return 'させられる';
  }

  if (baseVerb === '来る') {
    if (voice === VOICES.POTENTIAL) return '来られる';
    if (voice === VOICES.PASSIVE) return '来られる';
    if (voice === VOICES.CAUSATIVE) return '来させる';
    if (voice === VOICES.CAUSATIVE_PASSIVE) return '来させられる';
  }

  return baseVerb;
}

/**
 * Step 2: 將 Voiced 動詞轉換為指定的 Mode (模式)
 * 並應用 Modifiers (修飾詞)
 */
function applyModeAndModifiers(voicedVerb, originalVerbType, voice, mode, modifiers = {}) {
  const { polite = false, negative = false, past = false } = modifiers;

  // 判斷 voiced verb 的類型
  // 可能形、受身形、使役形等都會變成一段動詞
  let effectiveType = originalVerbType;
  if (voice !== VOICES.DICTIONARY && !voicedVerb.endsWith('する')) {
    effectiveType = 'ICHIDAN'; // 態變化後通常變成一段動詞
  }

  // === Mode: IMPERATIVE (命令形) ===
  // 命令形不允許任何修飾詞
  if (mode === MODES.IMPERATIVE) {
    if (effectiveType === 'ICHIDAN' || voice !== VOICES.DICTIONARY) {
      return voicedVerb.slice(0, -1) + 'ろ';
    }
    if (effectiveType === 'GODAN') {
      return getGodanERow(voicedVerb);
    }
    if (effectiveType === 'SURU' || voicedVerb.endsWith('する')) {
      // SURU 動詞：成功する → 成功しろ
      return voicedVerb.slice(0, -2) + 'しろ';
    }
    if (voicedVerb === 'する') return 'しろ';
    if (voicedVerb === '来る') return '来い';
  }

  // === Mode: VOLITIONAL (意向形) ===
  // 意向形只允許 polite 修飾詞
  if (mode === MODES.VOLITIONAL) {
    let volitionalForm;
    
    if (effectiveType === 'ICHIDAN' || voice !== VOICES.DICTIONARY) {
      volitionalForm = voicedVerb.slice(0, -1) + 'よう';
    } else if (effectiveType === 'GODAN') {
      volitionalForm = getGodanORow(voicedVerb) + 'う';
    } else if (effectiveType === 'SURU' || voicedVerb.endsWith('する')) {
      // SURU 動詞：成功する → 成功しよう
      volitionalForm = voicedVerb.slice(0, -2) + 'しよう';
    } else if (voicedVerb === 'する') {
      volitionalForm = 'しよう';
    } else if (voicedVerb === '来る') {
      volitionalForm = '来よう';
    }

    // 如果有 polite，轉成ましょう
    if (polite) {
      let masuStem;
      if (effectiveType === 'ICHIDAN' || voice !== VOICES.DICTIONARY) {
        masuStem = voicedVerb.slice(0, -1);
      } else if (effectiveType === 'GODAN') {
        masuStem = getGodanIRow(voicedVerb);
      } else if (effectiveType === 'SURU' || voicedVerb.endsWith('する')) {
        // SURU 動詞：成功する → 成功し
        masuStem = voicedVerb.slice(0, -2) + 'し';
      } else if (voicedVerb === 'する') {
        masuStem = 'し';
      } else if (voicedVerb === '来る') {
        masuStem = '来';
      }
      return masuStem + 'ましょう';
    }

    return volitionalForm;
  }

  // === Mode: TE_FORM (て形) ===
  // て形允許 negative 修飾詞
  if (mode === MODES.TE_FORM) {
    let teForm;
    
    if (effectiveType === 'ICHIDAN' || voice !== VOICES.DICTIONARY) {
      teForm = voicedVerb.slice(0, -1) + 'て';
    } else if (effectiveType === 'GODAN') {
      teForm = getGodanTaTeForm(voicedVerb, true);
    } else if (effectiveType === 'SURU' || voicedVerb.endsWith('する')) {
      // SURU 動詞：成功する → 成功して
      teForm = voicedVerb.slice(0, -2) + 'して';
    } else if (voicedVerb === 'する') {
      teForm = 'して';
    } else if (voicedVerb === '来る') {
      teForm = '来て';
    }

    // 如果有 negative，轉成なくて/ないで
    if (negative) {
      let naiStem;
      if (effectiveType === 'ICHIDAN' || voice !== VOICES.DICTIONARY) {
        naiStem = voicedVerb.slice(0, -1);
      } else if (effectiveType === 'GODAN') {
        naiStem = getGodanARow(voicedVerb);
      } else if (effectiveType === 'SURU' || voicedVerb.endsWith('する')) {
        // SURU 動詞：成功する → 成功し
        naiStem = voicedVerb.slice(0, -2) + 'し';
      } else if (voicedVerb === 'する') {
        naiStem = 'し';
      } else if (voicedVerb === '来る') {
        naiStem = '来';
      }
      return naiStem + 'なくて';
    }

    return teForm;
  }

  // === Mode: STANDARD (標準形) ===
  // 標準形允許所有修飾詞組合: polite, negative, past
  if (mode === MODES.STANDARD) {
    // 取得ます形詞幹和ない形詞幹
    let masuStem, naiStem;
    
    if (effectiveType === 'ICHIDAN' || voice !== VOICES.DICTIONARY) {
      masuStem = voicedVerb.slice(0, -1);
      naiStem = voicedVerb.slice(0, -1);
    } else if (effectiveType === 'GODAN') {
      masuStem = getGodanIRow(voicedVerb);
      naiStem = getGodanARow(voicedVerb);
    } else if (effectiveType === 'SURU' || voicedVerb.endsWith('する')) {
      // SURU 動詞：成功する → 成功し
      masuStem = voicedVerb.slice(0, -2) + 'し';
      naiStem = voicedVerb.slice(0, -2) + 'し';
    } else if (voicedVerb === 'する') {
      masuStem = 'し';
      naiStem = 'し';
    } else if (voicedVerb === '来る') {
      masuStem = '来';
      naiStem = '来';
    }

    // 處理 8 種組合
    // 1. Plain Present Affirmative: 食べる
    if (!polite && !negative && !past) {
      return voicedVerb;
    }

    // 2. Plain Present Negative: 食べない
    if (!polite && negative && !past) {
      return naiStem + 'ない';
    }

    // 3. Plain Past Affirmative: 食べた
    if (!polite && !negative && past) {
      if (effectiveType === 'ICHIDAN' || voice !== VOICES.DICTIONARY) {
        return voicedVerb.slice(0, -1) + 'た';
      }
      if (effectiveType === 'GODAN') {
        return getGodanTaTeForm(voicedVerb, false);
      }
      if (effectiveType === 'SURU' || voicedVerb.endsWith('する')) {
        // SURU 動詞：成功する → 成功した
        return voicedVerb.slice(0, -2) + 'した';
      }
      if (voicedVerb === 'する') return 'した';
      if (voicedVerb === '来る') return '来た';
    }

    // 4. Plain Past Negative: 食べなかった
    if (!polite && negative && past) {
      return naiStem + 'なかった';
    }

    // 5. Polite Present Affirmative: 食べます
    if (polite && !negative && !past) {
      return masuStem + 'ます';
    }

    // 6. Polite Present Negative: 食べません
    if (polite && negative && !past) {
      return masuStem + 'ません';
    }

    // 7. Polite Past Affirmative: 食べました
    if (polite && !negative && past) {
      return masuStem + 'ました';
    }

    // 8. Polite Past Negative: 食べませんでした
    if (polite && negative && past) {
      return masuStem + 'ませんでした';
    }
  }

  return voicedVerb;
}

/**
 * 主要變化函數 (New Orthogonal System)
 * @param {Object} verb - 動詞對象
 * @param {string} voice - Voice (態): DICTIONARY, POTENTIAL, PASSIVE, CAUSATIVE, CAUSATIVE_PASSIVE
 * @param {string} mode - Mode (模式): STANDARD, TE_FORM, VOLITIONAL, IMPERATIVE
 * @param {Object} modifiers - Modifiers (修飾詞): { polite, negative, past }
 */
export function conjugate(verb, voice, mode, modifiers = {}) {
  const baseVerb = verb.dictionary;
  const verbType = verb.type;

  // Step 1: Transform to Voice
  const voicedVerb = transformToVoice(baseVerb, verbType, voice);

  // Step 2: Apply Mode and Modifiers
  const result = applyModeAndModifiers(voicedVerb, verbType, voice, mode, modifiers);

  return result;
}

/**
 * 生成隨機題目 (使用新的正交系統)
 */
export function generateQuestion(verb, enabledVoices, enabledModes, enabledModifiers) {
  // 隨機選擇 Voice
  const randomVoice = enabledVoices[Math.floor(Math.random() * enabledVoices.length)];
  
  // 隨機選擇 Mode
  const randomMode = enabledModes[Math.floor(Math.random() * enabledModes.length)];
  
  // 根據 Mode 決定可用的 Modifiers
  const allowedModifiers = MODE_ALLOWED_MODIFIERS[randomMode];
  const modifiers = {};

  // 只在允許的範圍內隨機添加修飾詞
  if (allowedModifiers.includes(MODIFIERS.POLITE) && enabledModifiers.polite && Math.random() > 0.5) {
    modifiers.polite = true;
  }
  if (allowedModifiers.includes(MODIFIERS.NEGATIVE) && enabledModifiers.negative && Math.random() > 0.5) {
    modifiers.negative = true;
  }
  if (allowedModifiers.includes(MODIFIERS.PAST) && enabledModifiers.past && Math.random() > 0.5) {
    modifiers.past = true;
  }

  const answer = conjugate(verb, randomVoice, randomMode, modifiers);

  return {
    verb,
    voice: randomVoice,
    mode: randomMode,
    modifiers,
    answer
  };
}

/**
 * 生成問題描述文字 (使用新的正交系統)
 */
export function getQuestionDescription(voice, mode, modifiers = {}) {
  const parts = [];

  // Layer A: Voice
  if (voice !== VOICES.DICTIONARY) {
    parts.push(VOICE_NAMES[voice]);
  }

  // Layer B: Mode
  if (mode !== MODES.STANDARD) {
    parts.push(MODE_NAMES[mode]);
  }

  // Layer C: Modifiers
  const modifierParts = [];
  if (modifiers.polite) modifierParts.push(MODIFIER_NAMES[MODIFIERS.POLITE]);
  if (modifiers.negative) modifierParts.push(MODIFIER_NAMES[MODIFIERS.NEGATIVE]);
  if (modifiers.past) modifierParts.push(MODIFIER_NAMES[MODIFIERS.PAST]);

  if (modifierParts.length > 0) {
    parts.push(...modifierParts);
  }

  // 如果什麼都沒有，就是基本形
  if (parts.length === 0) {
    return '基本形（辭書形）';
  }

  return parts.join(' + ');
}

/**
 * 檢查修飾詞是否被允許
 */
export function isModifierAllowed(mode, modifier) {
  return MODE_ALLOWED_MODIFIERS[mode]?.includes(modifier) || false;
}

/**
 * 取得動詞類型的中文名稱
 */
export function getVerbTypeName(type) {
  const names = {
    'GODAN': '五段動詞 (Group I)',
    'ICHIDAN': '一段動詞 (Group II)',
    'IRREGULAR': '不規則動詞 (Group III)',
    'SURU': 'サ変動詞 (する複合)'
  };
  return names[type] || type;
}

/**
 * 取得動詞類型的簡短名稱
 */
export function getVerbTypeShort(type) {
  const names = {
    'GODAN': '五段',
    'ICHIDAN': '一段',
    'IRREGULAR': '不規則',
    'SURU': 'サ変'
  };
  return names[type] || type;
}

export default {
  conjugate,
  generateQuestion,
  getQuestionDescription,
  isModifierAllowed,
  getVerbTypeName,
  getVerbTypeShort,
  VOICES,
  VOICE_NAMES,
  MODES,
  MODE_NAMES,
  MODIFIERS,
  MODIFIER_NAMES,
  MODE_ALLOWED_MODIFIERS
};
