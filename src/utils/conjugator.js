// 日語動詞變化引擎
// 支援四類動詞的各種變化形式: GODAN, ICHIDAN, IRREGULAR, SURU

/**
 * 動詞變化形式
 */
export const CONJUGATION_FORMS = {
  DICTIONARY: 'dictionary',       // 辞書形
  POLITE: 'polite',              // 丁寧形 (ます形)
  NEGATIVE: 'negative',          // 否定形 (ない形)
  PAST: 'past',                  // 過去形 (た形)
  TE_FORM: 'te',                 // て形
  POTENTIAL: 'potential',        // 可能形
  PASSIVE: 'passive',            // 受身形
  CAUSATIVE: 'causative',        // 使役形
  IMPERATIVE: 'imperative',      // 命令形
  VOLITIONAL: 'volitional',      // 意志形
};

/**
 * 變化形式的名稱映射
 */
export const FORM_NAMES = {
  [CONJUGATION_FORMS.DICTIONARY]: '辞書形',
  [CONJUGATION_FORMS.POLITE]: 'ます形',
  [CONJUGATION_FORMS.NEGATIVE]: 'ない形',
  [CONJUGATION_FORMS.PAST]: 'た形',
  [CONJUGATION_FORMS.TE_FORM]: 'て形',
  [CONJUGATION_FORMS.POTENTIAL]: '可能形',
  [CONJUGATION_FORMS.PASSIVE]: '受身形',
  [CONJUGATION_FORMS.CAUSATIVE]: '使役形',
  [CONJUGATION_FORMS.IMPERATIVE]: '命令形',
  [CONJUGATION_FORMS.VOLITIONAL]: '意志形',
};

/**
 * 變化形式的英文名稱
 */
export const FORM_NAMES_EN = {
  [CONJUGATION_FORMS.DICTIONARY]: 'Dictionary',
  [CONJUGATION_FORMS.POLITE]: 'Polite (masu)',
  [CONJUGATION_FORMS.NEGATIVE]: 'Negative (nai)',
  [CONJUGATION_FORMS.PAST]: 'Past (ta)',
  [CONJUGATION_FORMS.TE_FORM]: 'Te-form',
  [CONJUGATION_FORMS.POTENTIAL]: 'Potential',
  [CONJUGATION_FORMS.PASSIVE]: 'Passive',
  [CONJUGATION_FORMS.CAUSATIVE]: 'Causative',
  [CONJUGATION_FORMS.IMPERATIVE]: 'Imperative',
  [CONJUGATION_FORMS.VOLITIONAL]: 'Volitional',
};

/**
 * 修飾詞類型
 */
export const MODIFIERS = {
  POLITE_STYLE: 'politeStyle',    // 丁寧語
  NEGATIVE: 'negative',           // 否定
  PAST: 'past',                   // 過去
};

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
 * 五段動詞的a段變化 (用於否定形、使役形等)
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
 * 五段動詞的e段變化 (用於可能形、命令形等)
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
 * 五段動詞的i段變化 (用於ます形)
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
 * 五段動詞的o段變化 (用於意志形)
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

/**
 * 主要變化函數
 */
export function conjugate(verb, type, form, modifiers = {}) {
  const { politeStyle = false, negative = false, past = false } = modifiers;
  
  // 辭書形
  if (form === CONJUGATION_FORMS.DICTIONARY) {
    return verb.dictionary;
  }
  
  const baseVerb = verb.dictionary;
  const verbType = verb.type;
  
  // === SURU 複合動詞處理 ===
  if (verbType === 'SURU') {
    const suruStem = getSuruStem(baseVerb);
    
    if (form === CONJUGATION_FORMS.POLITE) {
      if (past && negative) return suruStem + 'しませんでした';
      if (past) return suruStem + 'しました';
      if (negative) return suruStem + 'しません';
      return suruStem + 'します';
    }
    if (form === CONJUGATION_FORMS.NEGATIVE) {
      if (past && politeStyle) return suruStem + 'しませんでした';
      if (past) return suruStem + 'しなかった';
      if (politeStyle) return suruStem + 'しません';
      return suruStem + 'しない';
    }
    if (form === CONJUGATION_FORMS.PAST) {
      if (negative && politeStyle) return suruStem + 'しませんでした';
      if (negative) return suruStem + 'しなかった';
      if (politeStyle) return suruStem + 'しました';
      return suruStem + 'した';
    }
    if (form === CONJUGATION_FORMS.TE_FORM) return suruStem + 'して';
    if (form === CONJUGATION_FORMS.POTENTIAL) return suruStem + 'できる';
    if (form === CONJUGATION_FORMS.PASSIVE) return suruStem + 'される';
    if (form === CONJUGATION_FORMS.CAUSATIVE) return suruStem + 'させる';
    if (form === CONJUGATION_FORMS.IMPERATIVE) return suruStem + 'しろ';
    if (form === CONJUGATION_FORMS.VOLITIONAL) return suruStem + 'しよう';
  }
  
  // === ます形 (Polite Form) ===
  if (form === CONJUGATION_FORMS.POLITE) {
    let stem;
    if (verbType === 'ICHIDAN') {
      stem = baseVerb.slice(0, -1);
    } else if (verbType === 'GODAN') {
      stem = getGodanIRow(baseVerb);
    } else if (baseVerb === 'する') {
      stem = 'し';
    } else if (baseVerb === '来る') {
      stem = '来';
    }
    
    if (past && negative) return stem + 'ませんでした';
    if (past) return stem + 'ました';
    if (negative) return stem + 'ません';
    return stem + 'ます';
  }
  
  // === ない形 (Negative Form) ===
  if (form === CONJUGATION_FORMS.NEGATIVE) {
    let stem;
    if (verbType === 'ICHIDAN') {
      stem = baseVerb.slice(0, -1);
    } else if (verbType === 'GODAN') {
      stem = getGodanARow(baseVerb);
    } else if (baseVerb === 'する') {
      stem = 'し';
    } else if (baseVerb === '来る') {
      stem = '来';
    }
    
    if (past && politeStyle) return stem + 'ませんでした';
    if (past) return stem + 'なかった';
    if (politeStyle) return stem + 'ません';
    return stem + 'ない';
  }
  
  // === た形 (Past Form) ===
  if (form === CONJUGATION_FORMS.PAST) {
    if (verbType === 'ICHIDAN') {
      const stem = baseVerb.slice(0, -1);
      if (negative && politeStyle) return stem + 'ませんでした';
      if (negative) return stem + 'なかった';
      if (politeStyle) return stem + 'ました';
      return stem + 'た';
    } else if (verbType === 'GODAN') {
      if (negative && politeStyle) return getGodanIRow(baseVerb) + 'ませんでした';
      if (negative) return getGodanARow(baseVerb) + 'なかった';
      if (politeStyle) return getGodanIRow(baseVerb) + 'ました';
      return getGodanTaTeForm(baseVerb, false);
    } else if (baseVerb === 'する') {
      if (negative && politeStyle) return 'しませんでした';
      if (negative) return 'しなかった';
      if (politeStyle) return 'しました';
      return 'した';
    } else if (baseVerb === '来る') {
      if (negative && politeStyle) return '来ませんでした';
      if (negative) return '来なかった';
      if (politeStyle) return '来ました';
      return '来た';
    }
  }
  
  // === て形 (Te Form) ===
  if (form === CONJUGATION_FORMS.TE_FORM) {
    if (verbType === 'ICHIDAN') {
      return baseVerb.slice(0, -1) + 'て';
    } else if (verbType === 'GODAN') {
      return getGodanTaTeForm(baseVerb, true);
    } else if (baseVerb === 'する') {
      return 'して';
    } else if (baseVerb === '来る') {
      return '来て';
    }
  }
  
  // === 可能形 (Potential Form) ===
  if (form === CONJUGATION_FORMS.POTENTIAL) {
    let potentialForm;
    if (verbType === 'ICHIDAN') {
      potentialForm = baseVerb.slice(0, -1) + 'られる';
    } else if (verbType === 'GODAN') {
      potentialForm = getGodanERow(baseVerb) + 'る';
    } else if (baseVerb === 'する') {
      potentialForm = 'できる';
    } else if (baseVerb === '来る') {
      potentialForm = '来られる';
    }
    
    if (past && negative) return potentialForm.slice(0, -1) + 'なかった';
    if (past) return potentialForm.slice(0, -1) + 'た';
    if (negative) return potentialForm.slice(0, -1) + 'ない';
    return potentialForm;
  }
  
  // === 受身形 (Passive Form) ===
  if (form === CONJUGATION_FORMS.PASSIVE) {
    if (verbType === 'ICHIDAN') {
      return baseVerb.slice(0, -1) + 'られる';
    } else if (verbType === 'GODAN') {
      return getGodanARow(baseVerb) + 'れる';
    } else if (baseVerb === 'する') {
      return 'される';
    } else if (baseVerb === '来る') {
      return '来られる';
    }
  }
  
  // === 使役形 (Causative Form) ===
  if (form === CONJUGATION_FORMS.CAUSATIVE) {
    if (verbType === 'ICHIDAN') {
      return baseVerb.slice(0, -1) + 'させる';
    } else if (verbType === 'GODAN') {
      return getGodanARow(baseVerb) + 'せる';
    } else if (baseVerb === 'する') {
      return 'させる';
    } else if (baseVerb === '来る') {
      return '来させる';
    }
  }
  
  // === 命令形 (Imperative Form) ===
  if (form === CONJUGATION_FORMS.IMPERATIVE) {
    if (verbType === 'ICHIDAN') {
      return baseVerb.slice(0, -1) + 'ろ';
    } else if (verbType === 'GODAN') {
      return getGodanERow(baseVerb);
    } else if (baseVerb === 'する') {
      return 'しろ';
    } else if (baseVerb === '来る') {
      return '来い';
    }
  }
  
  // === 意志形 (Volitional Form) ===
  if (form === CONJUGATION_FORMS.VOLITIONAL) {
    if (verbType === 'ICHIDAN') {
      return baseVerb.slice(0, -1) + 'よう';
    } else if (verbType === 'GODAN') {
      return getGodanORow(baseVerb) + 'う';
    } else if (baseVerb === 'する') {
      return 'しよう';
    } else if (baseVerb === '来る') {
      return '来よう';
    }
  }
  
  return baseVerb;
}

/**
 * 生成隨機題目
 */
export function generateQuestion(verb, enabledForms, enabledModifiers) {
  // 從啟用的形式中隨機選擇
  const randomForm = enabledForms[Math.floor(Math.random() * enabledForms.length)];
  
  // 生成修飾詞組合
  const modifiers = {};
  
  // 某些形式不適用修飾詞
  const noModifierForms = [CONJUGATION_FORMS.DICTIONARY, CONJUGATION_FORMS.TE_FORM, CONJUGATION_FORMS.IMPERATIVE];
  
  if (!noModifierForms.includes(randomForm)) {
    // 隨機決定是否加上修飾詞
    if (enabledModifiers.polite && Math.random() > 0.5) {
      modifiers.politeStyle = true;
    }
    if (enabledModifiers.negative && Math.random() > 0.5) {
      modifiers.negative = true;
    }
    if (enabledModifiers.past && Math.random() > 0.5) {
      modifiers.past = true;
    }
  }
  
  const answer = conjugate(verb, verb.type, randomForm, modifiers);
  
  return {
    verb,
    form: randomForm,
    modifiers,
    answer
  };
}

/**
 * 生成問題描述文字
 */
export function getQuestionDescription(form, modifiers = {}) {
  const parts = [];
  
  if (modifiers.negative) parts.push('否定');
  if (modifiers.past) parts.push('過去');
  if (modifiers.politeStyle) parts.push('丁寧');
  
  parts.push(FORM_NAMES[form]);
  
  return parts.join(' + ');
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
  getVerbTypeName,
  getVerbTypeShort,
  CONJUGATION_FORMS,
  FORM_NAMES,
  FORM_NAMES_EN,
  MODIFIERS
};
