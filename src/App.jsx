import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  ChevronRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  Volume2,
  VolumeX,
  AlertCircle
} from 'lucide-react';
import verbs from './data/verbs';
import { 
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
} from './utils/conjugator';
import { romajiToHiragana, containsJapanese } from './utils/romaji';
import { speakJapanese, initSpeech, checkJapaneseVoiceAvailability } from './utils/speech';

// === 教學資料 ===
const conjugationGuides = {
  GODAN: {
    title: '五段動詞 (Group I / u-verbs)',
    description: '詞尾以「う段」結尾的動詞,變化時詞尾會在五十音圖的五個段之間變化。',
    rules: [
      {
        form: 'ます形',
        rule: '詞尾 う段 → い段 + ます',
        examples: [
          { base: '書く', result: '書きます', explanation: 'く → き + ます' },
          { base: '読む', result: '読みます', explanation: 'む → み + ます' },
          { base: '買う', result: '買います', explanation: 'う → い + ます' },
        ]
      },
      {
        form: 'ない形',
        rule: '詞尾 う段 → あ段 + ない (特殊: う → わ)',
        examples: [
          { base: '書く', result: '書かない', explanation: 'く → か + ない' },
          { base: '読む', result: '読まない', explanation: 'む → ま + ない' },
          { base: '買う', result: '買わない', explanation: 'う → わ + ない (特殊)' },
        ]
      },
      {
        form: 'た形 / て形',
        rule: '音便規則 (依詞尾不同)',
        examples: [
          { base: '書く', result: '書いた/書いて', explanation: 'く → いた/いて' },
          { base: '泳ぐ', result: '泳いだ/泳いで', explanation: 'ぐ → いだ/いで' },
          { base: '読む', result: '読んだ/読んで', explanation: 'む/ぶ/ぬ → んだ/んで' },
          { base: '待つ', result: '待った/待って', explanation: 'つ/う/る → った/って' },
          { base: '話す', result: '話した/話して', explanation: 'す → した/して' },
          { base: '行く', result: '行った/行って', explanation: '行く 是特例' },
        ]
      },
      {
        form: '可能形',
        rule: '詞尾 う段 → え段 + る',
        examples: [
          { base: '書く', result: '書ける', explanation: 'く → け + る' },
          { base: '読む', result: '読める', explanation: 'む → め + る' },
        ]
      },
      {
        form: '意志形',
        rule: '詞尾 う段 → お段 + う',
        examples: [
          { base: '書く', result: '書こう', explanation: 'く → こ + う' },
          { base: '読む', result: '読もう', explanation: 'む → も + う' },
        ]
      },
    ]
  },
  ICHIDAN: {
    title: '一段動詞 (Group II / ru-verbs)',
    description: '詞尾以「る」結尾,且る前面是「い段」或「え段」的動詞。變化較簡單,去掉「る」加上詞尾即可。',
    rules: [
      {
        form: 'ます形',
        rule: '去掉 る + ます',
        examples: [
          { base: '食べる', result: '食べます', explanation: '食べ + ます' },
          { base: '見る', result: '見ます', explanation: '見 + ます' },
        ]
      },
      {
        form: 'ない形',
        rule: '去掉 る + ない',
        examples: [
          { base: '食べる', result: '食べない', explanation: '食べ + ない' },
          { base: '見る', result: '見ない', explanation: '見 + ない' },
        ]
      },
      {
        form: 'た形 / て形',
        rule: '去掉 る + た/て',
        examples: [
          { base: '食べる', result: '食べた/食べて', explanation: '食べ + た/て' },
          { base: '見る', result: '見た/見て', explanation: '見 + た/て' },
        ]
      },
      {
        form: '可能形',
        rule: '去掉 る + られる',
        examples: [
          { base: '食べる', result: '食べられる', explanation: '食べ + られる' },
          { base: '見る', result: '見られる', explanation: '見 + られる' },
        ]
      },
      {
        form: '意志形',
        rule: '去掉 る + よう',
        examples: [
          { base: '食べる', result: '食べよう', explanation: '食べ + よう' },
          { base: '見る', result: '見よう', explanation: '見 + よう' },
        ]
      },
    ]
  },
  IRREGULAR: {
    title: '不規則動詞 (Group III)',
    description: '日語只有兩個不規則動詞:「する」和「来る」。它們的變化需要特別記憶。',
    rules: [
      {
        form: 'する 的變化',
        rule: '特殊變化',
        examples: [
          { base: 'する', result: 'します', explanation: 'ます形' },
          { base: 'する', result: 'しない', explanation: 'ない形' },
          { base: 'する', result: 'した', explanation: 'た形' },
          { base: 'する', result: 'して', explanation: 'て形' },
          { base: 'する', result: 'できる', explanation: '可能形' },
          { base: 'する', result: 'しよう', explanation: '意志形' },
        ]
      },
      {
        form: '来る (くる) 的變化',
        rule: '特殊變化 (注意讀音變化)',
        examples: [
          { base: '来る', result: '来ます (きます)', explanation: 'ます形' },
          { base: '来る', result: '来ない (こない)', explanation: 'ない形' },
          { base: '来る', result: '来た (きた)', explanation: 'た形' },
          { base: '来る', result: '来て (きて)', explanation: 'て形' },
          { base: '来る', result: '来られる (こられる)', explanation: '可能形' },
          { base: '来る', result: '来よう (こよう)', explanation: '意志形' },
        ]
      },
    ]
  },
  SURU: {
    title: 'サ変動詞 (する複合動詞)',
    description: '名詞 + する 構成的動詞,如「勉強する」「運動する」等。變化方式與「する」相同。',
    rules: [
      {
        form: '基本變化',
        rule: '名詞 + する的各種形式',
        examples: [
          { base: '勉強する', result: '勉強します', explanation: 'ます形' },
          { base: '勉強する', result: '勉強しない', explanation: 'ない形' },
          { base: '勉強する', result: '勉強した', explanation: 'た形' },
          { base: '勉強する', result: '勉強して', explanation: 'て形' },
          { base: '勉強する', result: '勉強できる', explanation: '可能形' },
        ]
      },
    ]
  }
};

// === 元件: 語音警告提示 ===
function VoiceWarning({ show, onClose }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
    >
      <div className="bg-jp-secondary text-white rounded-xl shadow-2xl p-4 border-2 border-jp-secondary/60">
        <div className="flex items-start gap-3">
          <VolumeX className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">語音功能無法使用</h3>
            <p className="text-sm opacity-90">
              您的瀏覽器不支援日語語音或未安裝日語語音包。語音朗讀功能將被停用，但不影響其他功能使用。
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-jp-secondary/80 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// === 元件: 教學面板 ===
function TutorialModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('GODAN');

  if (!isOpen) return null;

  const currentGuide = conjugationGuides[activeTab];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-jp-bg rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* 標題 */}
        <div className="p-6 border-b border-gray-200 bg-jp-primary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">動詞變化速查表</h2>
                <p className="text-white/90 text-sm">Conjugation Quick Reference</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab 導航 */}
        <div className="flex border-b-2 border-gray-200 bg-white px-6">
          {Object.entries(conjugationGuides).map(([type, guide]) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === type
                  ? 'text-jp-primary'
                  : 'text-gray-500 hover:text-jp-text'
              }`}
            >
              {getVerbTypeShort(type)}
              {activeTab === type && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-jp-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* 表格內容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentGuide && (
            <div className="space-y-4">
              {/* 簡介 */}
              <div className="bg-white rounded-xl p-4 border-l-4 border-jp-primary">
                <p className="text-jp-text font-medium">{currentGuide.description}</p>
              </div>

              {/* 變化規則表格 */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-jp-text text-white">
                      <th className="px-4 py-3 text-left font-semibold w-1/5">目標形式</th>
                      <th className="px-4 py-3 text-left font-semibold w-2/5">變化規則</th>
                      <th className="px-4 py-3 text-left font-semibold w-2/5">範例</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentGuide.rules.map((rule, idx) => (
                      <tr 
                        key={idx}
                        className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-jp-primary/5 transition-colors`}
                      >
                        <td className="px-4 py-4">
                          <span className="inline-block bg-jp-primary/20 text-jp-text px-3 py-1 rounded-lg font-bold text-sm">
                            {rule.form}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-jp-text font-medium text-sm leading-relaxed">
                            {rule.rule}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            {rule.examples.map((ex, exIdx) => (
                              <div key={exIdx} className="flex items-center gap-2 text-sm">
                                <span className="japanese-text font-bold text-jp-text">
                                  {ex.base}
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="japanese-text font-bold text-jp-primary">
                                  {ex.result}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 音便規則 (僅五段) */}
              {activeTab === 'GODAN' && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-jp-text mb-3 flex items-center gap-2 text-lg">
                    <Info className="w-5 h-5 text-jp-primary" />
                    音便規則速記
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-jp-bg p-3 rounded-lg border border-gray-200">
                      <span className="font-bold text-jp-primary japanese-text">く → いた/いて</span>
                      <div className="text-gray-600 text-sm mt-1">書く → 書いた</div>
                    </div>
                    <div className="bg-jp-bg p-3 rounded-lg border border-gray-200">
                      <span className="font-bold text-jp-primary japanese-text">ぐ → いだ/いで</span>
                      <div className="text-gray-600 text-sm mt-1">泳ぐ → 泳いだ</div>
                    </div>
                    <div className="bg-jp-bg p-3 rounded-lg border border-gray-200">
                      <span className="font-bold text-jp-primary japanese-text">す → した/して</span>
                      <div className="text-gray-600 text-sm mt-1">話す → 話した</div>
                    </div>
                    <div className="bg-jp-bg p-3 rounded-lg border border-gray-200">
                      <span className="font-bold text-jp-primary japanese-text">つ/う/る → った/って</span>
                      <div className="text-gray-600 text-sm mt-1">待つ → 待った</div>
                    </div>
                    <div className="bg-jp-bg p-3 rounded-lg border border-gray-200">
                      <span className="font-bold text-jp-primary japanese-text">ぬ/ぶ/む → んだ/んで</span>
                      <div className="text-gray-600 text-sm mt-1">読む → 読んだ</div>
                    </div>
                    <div className="bg-jp-secondary/10 p-3 rounded-lg border-2 border-jp-secondary">
                      <span className="font-bold text-jp-secondary japanese-text">特例: 行く → 行った</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部按鈕 */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-jp-primary hover:bg-jp-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            開始練習
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// === 元件: 設定面板 ===
function SettingsModal({ isOpen, onClose, settings, onSettingsChange }) {
  if (!isOpen) return null;

  const allVoices = Object.values(VOICES);
  const allModes = Object.values(MODES);
  const levels = ['N5', 'N4', 'N3'];
  const verbTypes = ['GODAN', 'ICHIDAN', 'IRREGULAR', 'SURU'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-jp-text flex items-center gap-2">
              <Settings className="w-6 h-6 text-jp-primary" />
              練習設定
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-jp-text transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 練習模式選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-jp-text mb-3">練習模式</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onSettingsChange({ ...settings, mode: 'perform' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.mode === 'perform'
                    ? 'border-jp-primary bg-jp-primary/10 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-jp-text">模式 A: 執行變化</div>
                <div className="text-sm text-gray-600 mt-1">看到動詞,輸入變化形式</div>
              </button>
              <button
                onClick={() => onSettingsChange({ ...settings, mode: 'recognize' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.mode === 'recognize'
                    ? 'border-jp-primary bg-jp-primary/10 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-jp-text">模式 B: 識別變化</div>
                <div className="text-sm text-gray-600 mt-1">看到變化,選擇正確形式</div>
              </button>
            </div>
          </div>

          {/* JLPT 等級選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-jp-text mb-3">JLPT 等級</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map(level => (
                <label
                  key={level}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.enabledLevels.includes(level)
                      ? 'border-jp-accent bg-jp-accent/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={settings.enabledLevels.includes(level)}
                    onChange={(e) => {
                      const newLevels = e.target.checked
                        ? [...settings.enabledLevels, level]
                        : settings.enabledLevels.filter(l => l !== level);
                      if (newLevels.length > 0) {
                        onSettingsChange({ ...settings, enabledLevels: newLevels });
                      }
                    }}
                    className="w-4 h-4 text-jp-accent rounded"
                  />
                  <span className="font-medium text-jp-text">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 動詞類型選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-jp-text mb-3">動詞類型</h3>
            <div className="flex flex-wrap gap-2">
              {verbTypes.map(type => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.enabledTypes.includes(type)
                      ? 'border-jp-primary bg-jp-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={settings.enabledTypes.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...settings.enabledTypes, type]
                        : settings.enabledTypes.filter(t => t !== type);
                      if (newTypes.length > 0) {
                        onSettingsChange({ ...settings, enabledTypes: newTypes });
                      }
                    }}
                    className="w-4 h-4 text-jp-primary rounded"
                  />
                  <span className="font-medium text-jp-text">{getVerbTypeShort(type)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Voice Selection (Layer A: 態) */}
          <div>
            <h3 className="text-lg font-semibold text-jp-text mb-3">第一層：態</h3>
            <div className="text-sm text-gray-600 mb-2">選擇要練習的動詞態（基本形、可能形、受身形等）</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allVoices.map(voice => (
                <label
                  key={voice}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.enabledVoices.includes(voice)
                      ? 'border-jp-primary bg-jp-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={settings.enabledVoices.includes(voice)}
                    onChange={(e) => {
                      const newVoices = e.target.checked
                        ? [...settings.enabledVoices, voice]
                        : settings.enabledVoices.filter(v => v !== voice);
                      if (newVoices.length > 0) {
                        onSettingsChange({ ...settings, enabledVoices: newVoices });
                      }
                    }}
                    className="w-4 h-4 text-jp-primary rounded"
                  />
                  <span className="text-sm font-medium text-jp-text">{VOICE_NAMES[voice]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mode Selection (Layer B: 模式) */}
          <div>
            <h3 className="text-lg font-semibold text-jp-text mb-3">第二層：模式</h3>
            <div className="text-sm text-gray-600 mb-2">選擇要練習的動詞模式（標準形、て形、意向形等）</div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              {allModes.map(mode => (
                <label
                  key={mode}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.enabledModes.includes(mode)
                      ? 'border-jp-primary bg-jp-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={settings.enabledModes.includes(mode)}
                    onChange={(e) => {
                      const newModes = e.target.checked
                        ? [...settings.enabledModes, mode]
                        : settings.enabledModes.filter(m => m !== mode);
                      if (newModes.length > 0) {
                        onSettingsChange({ ...settings, enabledModes: newModes });
                      }
                    }}
                    className="w-4 h-4 text-jp-primary rounded"
                  />
                  <span className="text-sm font-medium text-jp-text">{MODE_NAMES[mode]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Modifier Selection (Layer C: 修飾詞) */}
          <div>
            <h3 className="text-lg font-semibold text-jp-text mb-3">第三層：修飾詞</h3>
            <div className="text-sm text-gray-600 mb-2">選擇要練習的修飾詞（丁寧、否定、過去）</div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={settings.enabledModifiers.polite}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    enabledModifiers: { ...settings.enabledModifiers, polite: e.target.checked }
                  })}
                  className="w-4 h-4 text-jp-primary rounded"
                />
                <div>
                  <div className="font-medium text-jp-text">丁寧</div>
                  <div className="text-sm text-gray-600">加入禮貌形式的變化（です・ます）</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={settings.enabledModifiers.negative}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    enabledModifiers: { ...settings.enabledModifiers, negative: e.target.checked }
                  })}
                  className="w-4 h-4 text-jp-primary rounded"
                />
                <div>
                  <div className="font-medium text-jp-text">否定</div>
                  <div className="text-sm text-gray-600">加入否定變化（ない）</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={settings.enabledModifiers.past}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    enabledModifiers: { ...settings.enabledModifiers, past: e.target.checked }
                  })}
                  className="w-4 h-4 text-jp-primary rounded"
                />
                <div>
                  <div className="font-medium text-jp-text">過去</div>
                  <div className="text-sm text-gray-600">加入過去時態（た）</div>
                </div>
              </label>
            </div>
          </div>

          {/* 遊戲難度設定 */}
          <div>
            <h3 className="text-lg font-semibold text-jp-text mb-3">遊戲難度</h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showVerbGroupHint}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    showVerbGroupHint: e.target.checked
                  })}
                  className="w-4 h-4 text-jp-primary rounded mt-1"
                />
                <div>
                  <div className="font-medium text-jp-text">顯示動詞組別提示</div>
                  <div className="text-sm text-gray-600">在題目卡片上顯示動詞類型（五段/一段/不規則）。關閉此選項可提升真實感，需要自行判斷變化規則。</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-jp-primary hover:bg-jp-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            套用設定
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// === 元件: 統計面板 ===
function StatsBar({ currentStreak, maxStreak, totalCorrect, totalAttempts }) {
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div className="bg-jp-primary rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">當前連勝</span>
        </div>
        <div className="text-3xl font-bold">{currentStreak}</div>
      </div>
      <div className="bg-jp-text rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">最高連勝</span>
        </div>
        <div className="text-3xl font-bold">{maxStreak}</div>
      </div>
      <div className="bg-jp-accent rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">正確率</span>
        </div>
        <div className="text-3xl font-bold">{accuracy}%</div>
      </div>
      <div className="bg-jp-secondary rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">總題數</span>
        </div>
        <div className="text-3xl font-bold">{totalAttempts}</div>
      </div>
    </div>
  );
}

// === 元件: 題目表格顯示器 (使用三層正交系統) ===
function QuestionTable({ question }) {
  // Layer A: Voices
  const allVoices = [
    VOICES.DICTIONARY,
    VOICES.POTENTIAL,
    VOICES.PASSIVE,
    VOICES.CAUSATIVE,
    VOICES.CAUSATIVE_PASSIVE,
  ];

  // Layer B: Modes
  const allModes = [
    MODES.STANDARD,
    MODES.TE_FORM,
    MODES.VOLITIONAL,
    MODES.IMPERATIVE,
  ];

  // Layer C: Modifiers
  const allModifiers = [
    { key: MODIFIERS.POLITE, label: 'Polite', labelCN: '丁寧' },
    { key: MODIFIERS.NEGATIVE, label: 'Negative', labelCN: '否定' },
    { key: MODIFIERS.PAST, label: 'Past', labelCN: '過去' },
  ];

  // 檢查當前選中狀態
  const isVoiceSelected = (voice) => question.voice === voice;
  const isModeSelected = (mode) => question.mode === mode;
  const isModifierSelected = (modifier) => question.modifiers?.[modifier] === true;

  // 檢查修飾詞是否被允許（根據當前 mode）
  const isModifierAllowedForCurrentMode = (modifier) => {
    return MODE_ALLOWED_MODIFIERS[question.mode]?.includes(modifier) || false;
  };

  return (
    <div className="space-y-4">
      {/* 提示文字 */}
      <div className="text-center">
        <div className="text-xl font-bold text-jp-text">請變化為：</div>
      </div>

      {/* 三層表格 */}
      <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
        
        {/* === 第一層：態 === */}
        <div className="bg-jp-text text-white px-6 py-2 text-center font-semibold text-sm">
          第一層：態
        </div>
        <div className="grid grid-cols-5 border-b-2 border-gray-200">
          {allVoices.map(voice => {
            const selected = isVoiceSelected(voice);
            return (
              <div
                key={voice}
                className={`px-3 py-3 text-center border-r last:border-r-0 border-gray-200 transition-all ${
                  selected
                    ? 'bg-jp-success text-white font-bold'
                    : 'bg-white text-gray-600'
                }`}
              >
                <div className="text-xs">{VOICE_NAMES[voice]}</div>
              </div>
            );
          })}
        </div>

        {/* === 第二層：模式 === */}
        <div className="bg-jp-text text-white px-6 py-2 text-center font-semibold text-sm">
          第二層：模式
        </div>
        <div className="grid grid-cols-4 border-b-2 border-gray-200">
          {allModes.map(mode => {
            const selected = isModeSelected(mode);
            return (
              <div
                key={mode}
                className={`px-3 py-3 text-center border-r last:border-r-0 border-gray-200 transition-all ${
                  selected
                    ? 'bg-jp-success text-white font-bold'
                    : 'bg-white text-gray-600'
                }`}
              >
                <div className="text-xs">{MODE_NAMES[mode]}</div>
              </div>
            );
          })}
        </div>

        {/* === 第三層：修飾詞 === */}
        <div className="bg-jp-text text-white px-6 py-2 text-center font-semibold text-sm">
          第三層：修飾詞
        </div>
        <div className="grid grid-cols-3">
          {allModifiers.map(modifier => {
            const selected = isModifierSelected(modifier.key);
            const allowed = isModifierAllowedForCurrentMode(modifier.key);
            return (
              <div
                key={modifier.key}
                className={`px-4 py-3 text-center border-r last:border-r-0 border-gray-200 ${
                  !allowed
                    ? 'bg-gray-100 opacity-40'
                    : selected
                      ? 'bg-jp-success text-white font-bold'
                      : 'bg-white text-gray-600'
                }`}
              >
                <div className="text-xs">{modifier.labelCN}</div>
                {!allowed && <div className="text-[10px] text-gray-500 mt-1">(不適用)</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// === 元件: 模式 A - 執行變化 ===
function PerformMode({ question, onSubmit, onNext, feedback, userAnswer, voiceAvailable, showVerbGroupHint }) {
  const [inputValue, setInputValue] = useState('');
  const [convertedValue, setConvertedValue] = useState('');
  const inputRef = useRef(null); // 新增 ref

  useEffect(() => {
    setInputValue('');
    setConvertedValue('');
    // 自動朗讀動詞
    speakJapanese(question.verb.dictionary);
    // 自動聚焦到輸入框
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [question]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 即時轉換羅馬拼音
    if (!containsJapanese(value)) {
      const hiragana = romajiToHiragana(value);
      setConvertedValue(hiragana);
    } else {
      setConvertedValue(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 使用轉換後的值提交
    onSubmit(convertedValue || inputValue);
  };

  // 答對時朗讀正確答案
  useEffect(() => {
    if (feedback?.correct) {
      setTimeout(() => {
        speakJapanese(question.answer);
      }, 500);
    }
  }, [feedback]);

  // 加入 Enter 鍵監聽
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && feedback !== null) {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [feedback, onNext]);

  const openJisho = () => {
    window.open(`https://jisho.org/search/${question.verb.dictionary}`, '_blank');
  };

  return (
    <motion.div
      key={question.verb.dictionary + question.form}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* 動詞卡片 */}
      <div className="bg-jp-primary rounded-2xl p-8 text-white shadow-xl relative">
        <div className="text-center">
          {showVerbGroupHint && (
            <div className="flex justify-center gap-2 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {getVerbTypeShort(question.verb.type)}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {question.verb.level}
              </span>
            </div>
          )}
          {!showVerbGroupHint && (
            <div className="flex justify-center gap-2 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {question.verb.level}
              </span>
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mb-4">
            {voiceAvailable && (
              <button
                onClick={() => speakJapanese(question.verb.dictionary)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="朗讀動詞"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
            <div className="text-6xl font-bold japanese-text">{question.verb.dictionary}</div>
            <button
              onClick={openJisho}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="在 Jisho.org 查詢"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
          <div className="text-2xl opacity-90 mb-2">{question.verb.reading}</div>
          <div className="text-lg opacity-75">{question.verb.meaning}</div>
        </div>
      </div>

      {/* 問題表格 */}
      <QuestionTable question={question} />

      {/* 輸入區域 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={feedback !== null}
            placeholder="請輸入答案 (支援羅馬拼音或平假名)"
            className={`w-full text-3xl japanese-text text-center p-6 rounded-xl border-2 transition-all ${
              feedback === null
                ? 'border-gray-300 focus:border-jp-primary focus:ring-4 focus:ring-jp-primary/20 bg-white'
                : feedback.correct
                ? 'border-jp-success bg-jp-success/10'
                : 'border-jp-secondary bg-jp-secondary/10'
            } outline-none`}
          />
          {/* 即時轉換預覽 */}
          {inputValue && !containsJapanese(inputValue) && convertedValue !== inputValue && (
            <div className="text-center text-sm text-gray-600">
              轉換: <span className="japanese-text text-lg font-medium text-jp-primary">{convertedValue}</span>
            </div>
          )}
        </div>

        {feedback === null ? (
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-full bg-jp-primary hover:bg-jp-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            提交答案
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-6 rounded-xl ${
                feedback.correct ? 'bg-jp-success/20 border-2 border-jp-success' : 'bg-jp-secondary/20 border-2 border-jp-secondary'
              }`}
            >
              <div className="flex items-start gap-4">
                {feedback.correct ? (
                  <CheckCircle2 className="w-8 h-8 text-jp-success flex-shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-jp-secondary flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className={`text-xl font-bold mb-3 ${feedback.correct ? 'text-jp-success' : 'text-jp-secondary'}`}>
                    {feedback.correct ? '正確! 太棒了!' : '答錯了,再接再厲!'}
                  </div>
                  
                  {/* 變化分析 */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-jp-text">辭書形:</span>
                      <span className="japanese-text text-lg text-jp-text">{question.verb.dictionary}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-jp-text">變化:</span>
                      <span className="text-jp-primary font-medium">{getQuestionDescription(question.voice, question.mode, question.modifiers)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-jp-text">正確答案:</span>
                      <span className="japanese-text text-xl text-jp-success font-bold">{question.answer}</span>
                      {voiceAvailable && (
                        <button
                          onClick={() => speakJapanese(question.answer)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="朗讀答案"
                        >
                          <Volume2 className="w-4 h-4 text-jp-success" />
                        </button>
                      )}
                    </div>
                    {!feedback.correct && userAnswer && (
                      <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-200">
                        <span className="font-semibold text-jp-text">你的答案:</span>
                        <span className="japanese-text text-lg text-jp-secondary">{userAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            <button
              onClick={onNext}
              className="w-full bg-jp-primary hover:bg-jp-primary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              下一題
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </form>
    </motion.div>
  );
}

// === 元件: 互動式選擇表格 (用於 RecognizeMode，使用三層正交系統) ===
function InteractiveQuestionTable({ selectedTags, onTagToggle, disabled }) {
  // Layer A: Voices
  const allVoices = [
    VOICES.DICTIONARY,
    VOICES.POTENTIAL,
    VOICES.PASSIVE,
    VOICES.CAUSATIVE,
    VOICES.CAUSATIVE_PASSIVE,
  ];

  // Layer B: Modes
  const allModes = [
    MODES.STANDARD,
    MODES.TE_FORM,
    MODES.VOLITIONAL,
    MODES.IMPERATIVE,
  ];

  // Layer C: Modifiers
  const allModifiers = [
    { key: MODIFIERS.POLITE, label: 'Polite', labelCN: '丁寧' },
    { key: MODIFIERS.NEGATIVE, label: 'Negative', labelCN: '否定' },
    { key: MODIFIERS.PAST, label: 'Past', labelCN: '過去' },
  ];

  // 檢查修飾詞是否被允許（根據當前 mode）
  const isModifierAllowedForMode = (modifier) => {
    if (!selectedTags.mode) return true; // 沒選 mode 時，暫時允許所有
    return MODE_ALLOWED_MODIFIERS[selectedTags.mode]?.includes(modifier) || false;
  };

  return (
    <div className="space-y-4">
      {/* 提示文字 */}
      <div className="text-center">
        <div className="text-xl font-bold text-jp-text">請選擇變化形式：</div>
      </div>

      {/* 三層表格 */}
      <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
        
        {/* === 第一層：態 === */}
        <div className="bg-jp-text text-white px-6 py-2 text-center font-semibold text-sm">
          第一層：態
        </div>
        <div className="grid grid-cols-5 border-b-2 border-gray-200">
          {allVoices.map(voice => {
            const selected = selectedTags.voice === voice;
            return (
              <button
                key={voice}
                onClick={() => !disabled && onTagToggle('voice', voice)}
                disabled={disabled}
                className={`px-3 py-3 text-center border-r last:border-r-0 border-gray-200 transition-all ${
                  selected
                    ? 'bg-jp-success text-white font-bold'
                    : 'bg-white text-gray-600 hover:bg-jp-success/20'
                } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="text-xs">{VOICE_NAMES[voice]}</div>
              </button>
            );
          })}
        </div>

        {/* === 第二層：模式 === */}
        <div className="bg-jp-text text-white px-6 py-2 text-center font-semibold text-sm">
          第二層：模式
        </div>
        <div className="grid grid-cols-4 border-b-2 border-gray-200">
          {allModes.map(mode => {
            const selected = selectedTags.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => !disabled && onTagToggle('mode', mode)}
                disabled={disabled}
                className={`px-3 py-3 text-center border-r last:border-r-0 border-gray-200 transition-all ${
                  selected
                    ? 'bg-jp-success text-white font-bold'
                    : 'bg-white text-gray-600 hover:bg-jp-success/20'
                } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="text-xs">{MODE_NAMES[mode]}</div>
              </button>
            );
          })}
        </div>

        {/* === 第三層：修飾詞 === */}
        <div className="bg-jp-text text-white px-6 py-2 text-center font-semibold text-sm">
          第三層：修飾詞
        </div>
        <div className="grid grid-cols-3">
          {allModifiers.map(modifier => {
            const selected = selectedTags.modifiers?.[modifier.key] === true;
            const allowed = isModifierAllowedForMode(modifier.key);
            const modDisabled = !allowed || disabled;
            return (
              <button
                key={modifier.key}
                onClick={() => !modDisabled && onTagToggle('modifier', modifier.key)}
                disabled={modDisabled}
                className={`px-4 py-3 text-center border-r last:border-r-0 border-gray-200 transition-all ${
                  modDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-40'
                    : selected
                      ? 'bg-jp-success text-white font-bold cursor-pointer'
                      : 'bg-white text-gray-600 cursor-pointer hover:bg-jp-success/20'
                }`}
              >
                <div className="text-xs">{modifier.labelCN}</div>
                {!allowed && <div className="text-[10px] mt-1">(不適用)</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// === 元件: 模式 B - 識別變化 ===
function RecognizeMode({ question, onSubmit, onNext, feedback, voiceAvailable, showVerbGroupHint }) {
  const [selectedTags, setSelectedTags] = useState({
    voice: null,
    mode: null,
    modifiers: {
      polite: false,
      negative: false,
      past: false
    }
  });

  useEffect(() => {
    setSelectedTags({
      voice: null,
      mode: null,
      modifiers: {
        polite: false,
        negative: false,
        past: false
      }
    });
    // 自動朗讀變化後的動詞
    speakJapanese(question.answer);
  }, [question]);

  // 答對時再次朗讀
  useEffect(() => {
    if (feedback?.correct) {
      setTimeout(() => {
        speakJapanese(question.answer);
      }, 500);
    }
  }, [feedback]);

  // 加入 Enter 鍵監聽
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && feedback !== null) {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [feedback, onNext]);

  const handleSubmit = () => {
    onSubmit(selectedTags);
  };

  const openJisho = () => {
    window.open(`https://jisho.org/search/${question.verb.dictionary}`, '_blank');
  };

  const handleTagToggle = (type, value) => {
    if (type === 'voice') {
      setSelectedTags(prev => ({ ...prev, voice: value }));
    } else if (type === 'mode') {
      // 當切換 mode 時，清除不適用的修飾詞
      const newModifiers = { ...selectedTags.modifiers };
      const allowedMods = MODE_ALLOWED_MODIFIERS[value] || [];
      
      if (!allowedMods.includes(MODIFIERS.POLITE)) newModifiers.polite = false;
      if (!allowedMods.includes(MODIFIERS.NEGATIVE)) newModifiers.negative = false;
      if (!allowedMods.includes(MODIFIERS.PAST)) newModifiers.past = false;
      
      setSelectedTags(prev => ({ ...prev, mode: value, modifiers: newModifiers }));
    } else if (type === 'modifier') {
      setSelectedTags(prev => ({
        ...prev,
        modifiers: {
          ...prev.modifiers,
          [value]: !prev.modifiers[value]
        }
      }));
    }
  };

  return (
    <motion.div
      key={question.answer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* 變化後的動詞卡片 */}
      <div className="bg-jp-accent rounded-2xl p-8 text-white shadow-xl">
        <div className="text-center">
          <div className="text-sm font-medium opacity-80 mb-2">這是什麼變化形式?</div>
          <div className="flex items-center justify-center gap-3 mb-4">
            {voiceAvailable && (
              <button
                onClick={() => speakJapanese(question.answer)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="朗讀"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
            <div className="text-6xl font-bold japanese-text">{question.answer}</div>
          </div>
          {showVerbGroupHint && (
            <div className="flex justify-center gap-2 mt-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {getVerbTypeShort(question.verb.type)}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {question.verb.level}
              </span>
            </div>
          )}
          {!showVerbGroupHint && (
            <div className="flex justify-center gap-2 mt-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {question.verb.level}
              </span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-lg opacity-75 mt-2">
            <span>(來自: {question.verb.dictionary} - {question.verb.meaning})</span>
            <button
              onClick={openJisho}
              className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="在 Jisho.org 查詢"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 互動式選擇表格 */}
      <InteractiveQuestionTable
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        disabled={feedback !== null}
      />

      {/* 提交按鈕 */}
      {feedback === null ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedTags.voice || !selectedTags.mode}
          className="w-full bg-jp-primary hover:bg-jp-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          提交答案
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-xl ${
              feedback.correct ? 'bg-jp-success/20 border-2 border-jp-success' : 'bg-jp-secondary/20 border-2 border-jp-secondary'
            }`}
          >
            <div className="flex items-start gap-4">
              {feedback.correct ? (
                <CheckCircle2 className="w-8 h-8 text-jp-success flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-jp-secondary flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className={`text-xl font-bold mb-3 ${feedback.correct ? 'text-jp-success' : 'text-jp-secondary'}`}>
                  {feedback.correct ? '正確! 太棒了!' : '答錯了,再接再厵!'}
                </div>
                
                {/* 變化分析 */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-jp-text">辭書形:</span>
                    <span className="japanese-text text-lg text-jp-text">{question.verb.dictionary}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-jp-text">變化:</span>
                    <span className="text-jp-primary font-medium">{getQuestionDescription(question.voice, question.mode, question.modifiers)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-jp-text">變化結果:</span>
                    <span className="japanese-text text-xl text-jp-success font-bold">{question.answer}</span>
                    {voiceAvailable && (
                      <button
                        onClick={() => speakJapanese(question.answer)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="朗讀"
                      >
                        <Volume2 className="w-4 h-4 text-jp-success" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <button
            onClick={onNext}
            className="w-full bg-jp-primary hover:bg-jp-primary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            下一題
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </motion.div>
  );
}

// === 主要 App 元件 ===
function App() {
  const [settings, setSettings] = useState({
    mode: 'perform',
    enabledVoices: [
      VOICES.DICTIONARY,
      VOICES.POTENTIAL,
    ],
    enabledModes: [
      MODES.STANDARD,
      MODES.TE_FORM,
    ],
    enabledLevels: ['N5', 'N4', 'N3'],
    enabledTypes: ['GODAN', 'ICHIDAN', 'IRREGULAR', 'SURU'],
    enabledModifiers: {
      polite: true,
      negative: true,
      past: true
    },
    showVerbGroupHint: false  // 新增：預設不顯示動詞組別提示
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionId, setQuestionId] = useState(0); // 用於強制重新渲染
  const [feedback, setFeedback] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [voiceAvailable, setVoiceAvailable] = useState(true); // 語音是否可用
  const [showVoiceWarning, setShowVoiceWarning] = useState(false); // 是否顯示語音警告
  const [stats, setStats] = useState({
    currentStreak: 0,
    maxStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0
  });

  // 初始化語音系統
  useEffect(() => {
    initSpeech((available) => {
      setVoiceAvailable(available);
      if (!available) {
        setShowVoiceWarning(true);
        // 5秒後自動關閉警告
        setTimeout(() => setShowVoiceWarning(false), 5000);
      }
    });
  }, []);

  // 過濾後的動詞列表
  const filteredVerbs = useMemo(() => {
    return verbs.filter(v => 
      settings.enabledLevels.includes(v.level) &&
      settings.enabledTypes.includes(v.type)
    );
  }, [settings.enabledLevels, settings.enabledTypes]);

  // 生成新問題
  const generateNewQuestion = () => {
    if (filteredVerbs.length === 0) {
      return;
    }
    // 先重置狀態
    setFeedback(null);
    setUserAnswer('');
    // 然後生成新問題
    const randomVerb = filteredVerbs[Math.floor(Math.random() * filteredVerbs.length)];
    const question = generateQuestion(randomVerb, settings.enabledVoices, settings.enabledModes, settings.enabledModifiers);
    setCurrentQuestion(question);
    setQuestionId(prev => prev + 1); // 更新問題ID，強制重新渲染
  };

  // 初始化第一個問題
  useEffect(() => {
    generateNewQuestion();
  }, [filteredVerbs, settings.enabledVoices, settings.enabledModes]);

  // 處理答案提交 (模式 A)
  const handlePerformSubmit = (answer) => {
    const isCorrect = answer.trim() === currentQuestion.answer;
    setUserAnswer(answer);
    setFeedback({ correct: isCorrect });

    // 更新統計
    setStats(prev => ({
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      maxStreak: isCorrect ? Math.max(prev.maxStreak, prev.currentStreak + 1) : prev.maxStreak,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
      totalAttempts: prev.totalAttempts + 1
    }));
  };

  // 處理答案提交 (模式 B)
  const handleRecognizeSubmit = (selectedTags) => {
    // 比較 Voice, Mode, 和 Modifiers
    const isCorrect = (
      selectedTags.voice === currentQuestion.voice &&
      selectedTags.mode === currentQuestion.mode &&
      selectedTags.modifiers.polite === (currentQuestion.modifiers.polite || false) &&
      selectedTags.modifiers.negative === (currentQuestion.modifiers.negative || false) &&
      selectedTags.modifiers.past === (currentQuestion.modifiers.past || false)
    );

    // 生成用戶選擇的描述
    const userDescription = getQuestionDescription(
      selectedTags.voice, 
      selectedTags.mode, 
      selectedTags.modifiers
    );

    setFeedback({ correct: isCorrect, userDescription });

    // 更新統計
    setStats(prev => ({
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      maxStreak: isCorrect ? Math.max(prev.maxStreak, prev.currentStreak + 1) : prev.maxStreak,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
      totalAttempts: prev.totalAttempts + 1
    }));
  };

  // 重置統計
  const handleReset = () => {
    setStats({
      currentStreak: 0,
      maxStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0
    });
    generateNewQuestion();
  };

  return (
    <div className="min-h-screen bg-jp-bg">
      {/* 語音警告 */}
      <AnimatePresence>
        {showVoiceWarning && (
          <VoiceWarning 
            show={showVoiceWarning} 
            onClose={() => setShowVoiceWarning(false)} 
          />
        )}
      </AnimatePresence>

      {/* 頂部導航 */}
      <div className="bg-white backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <img 
                src="./logo.png" 
                alt="Logo" 
                className="w-10 h-10 rounded object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h1 className="text-2xl font-bold text-jp-text">日語動詞變化練習</h1>
                <p className="text-sm text-gray-600">
                  {filteredVerbs.length} 個動詞 | JLPT {settings.enabledLevels.join('/')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTutorial(true)}
                className="p-3 rounded-xl bg-jp-primary/10 hover:bg-jp-primary/20 text-jp-primary transition-colors"
                title="變化教學"
              >
                <GraduationCap className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-jp-accent/20 hover:bg-jp-accent/30 text-jp-accent transition-colors"
                title="重置統計"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 rounded-xl bg-jp-primary hover:bg-jp-primary/90 text-white transition-colors"
                title="設定"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <StatsBar {...stats} />

        {filteredVerbs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border-2 border-gray-200">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-xl font-bold text-jp-text mb-2">沒有符合條件的動詞</h3>
            <p className="text-gray-600 mb-4">請調整設定中的 JLPT 等級或動詞類型</p>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-jp-primary hover:bg-jp-primary/90 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
            >
              開啟設定
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {currentQuestion && (
              settings.mode === 'perform' ? (
                <PerformMode
                  key={`perform-${questionId}`}
                  question={currentQuestion}
                  onSubmit={handlePerformSubmit}
                  onNext={generateNewQuestion}
                  feedback={feedback}
                  userAnswer={userAnswer}
                  voiceAvailable={voiceAvailable}
                  showVerbGroupHint={settings.showVerbGroupHint}
                />
              ) : (
                <RecognizeMode
                  key={`recognize-${questionId}`}
                  question={currentQuestion}
                  onSubmit={handleRecognizeSubmit}
                  onNext={generateNewQuestion}
                  feedback={feedback}
                  voiceAvailable={voiceAvailable}
                  showVerbGroupHint={settings.showVerbGroupHint}
                />
              )
            )}
          </AnimatePresence>
        )}
      </div>

      {/* 設定模態框 */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSettingsChange={setSettings}
          />
        )}
      </AnimatePresence>

      {/* 教學模態框 */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialModal
            isOpen={showTutorial}
            onClose={() => setShowTutorial(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
