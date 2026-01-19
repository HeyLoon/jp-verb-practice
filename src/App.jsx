import { useState, useEffect, useMemo } from 'react';
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
  Info
} from 'lucide-react';
import verbs from './data/verbs';
import { 
  conjugate, 
  generateQuestion, 
  getQuestionDescription,
  getVerbTypeName,
  getVerbTypeShort,
  CONJUGATION_FORMS,
  FORM_NAMES,
  FORM_NAMES_EN
} from './utils/conjugator';

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

// === 元件: 教學面板 ===
function TutorialModal({ isOpen, onClose }) {
  const [expandedType, setExpandedType] = useState('GODAN');
  const [expandedRule, setExpandedRule] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* 標題 */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">動詞變化教學</h2>
                <p className="text-indigo-100 text-sm">Japanese Verb Conjugation Guide</p>
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

        {/* 動詞類型選擇 */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          {Object.entries(conjugationGuides).map(([type, guide]) => (
            <button
              key={type}
              onClick={() => { setExpandedType(type); setExpandedRule(0); }}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                expandedType === type
                  ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {getVerbTypeShort(type)}
            </button>
          ))}
        </div>

        {/* 教學內容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {conjugationGuides[expandedType] && (
            <div className="space-y-6">
              {/* 標題與描述 */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {conjugationGuides[expandedType].title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {conjugationGuides[expandedType].description}
                </p>
              </div>

              {/* 變化規則 */}
              <div className="space-y-4">
                {conjugationGuides[expandedType].rules.map((rule, idx) => (
                  <div 
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedRule(expandedRule === idx ? -1 : idx)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                          {rule.form}
                        </span>
                        <span className="text-slate-700 font-medium">{rule.rule}</span>
                      </div>
                      {expandedRule === idx ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedRule === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-200 bg-slate-50"
                        >
                          <div className="p-4 space-y-3">
                            {rule.examples.map((ex, exIdx) => (
                              <div 
                                key={exIdx}
                                className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm"
                              >
                                <span className="text-2xl font-bold text-slate-800 japanese-text min-w-[80px]">
                                  {ex.base}
                                </span>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                                <span className="text-2xl font-bold text-indigo-600 japanese-text min-w-[120px]">
                                  {ex.result}
                                </span>
                                <span className="text-sm text-slate-500 flex-1">
                                  {ex.explanation}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* 音便規則詳解 (僅五段動詞) */}
              {expandedType === 'GODAN' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    音便規則速記表
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <span className="font-bold text-amber-700">く → いた/いて</span>
                      <span className="text-slate-600 ml-2">書く → 書いた</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <span className="font-bold text-amber-700">ぐ → いだ/いで</span>
                      <span className="text-slate-600 ml-2">泳ぐ → 泳いだ</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <span className="font-bold text-amber-700">す → した/して</span>
                      <span className="text-slate-600 ml-2">話す → 話した</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <span className="font-bold text-amber-700">つ/う/る → った/って</span>
                      <span className="text-slate-600 ml-2">待つ → 待った</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <span className="font-bold text-amber-700">ぬ/ぶ/む → んだ/んで</span>
                      <span className="text-slate-600 ml-2">読む → 読んだ</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-2 border-amber-300">
                      <span className="font-bold text-red-600">特例: 行く → 行った</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部按鈕 */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
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

  const allForms = Object.values(CONJUGATION_FORMS);
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
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary-600" />
              練習設定
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 練習模式選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">練習模式</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onSettingsChange({ ...settings, mode: 'perform' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.mode === 'perform'
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-800">模式 A: 執行變化</div>
                <div className="text-sm text-slate-600 mt-1">看到動詞,輸入變化形式</div>
              </button>
              <button
                onClick={() => onSettingsChange({ ...settings, mode: 'recognize' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.mode === 'recognize'
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-800">模式 B: 識別變化</div>
                <div className="text-sm text-slate-600 mt-1">看到變化,選擇正確形式</div>
              </button>
            </div>
          </div>

          {/* JLPT 等級選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">JLPT 等級</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map(level => (
                <label
                  key={level}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.enabledLevels.includes(level)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
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
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-medium text-slate-700">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 動詞類型選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">動詞類型</h3>
            <div className="flex flex-wrap gap-2">
              {verbTypes.map(type => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.enabledTypes.includes(type)
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300'
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
                    className="w-4 h-4 text-violet-600 rounded"
                  />
                  <span className="font-medium text-slate-700">{getVerbTypeShort(type)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 變化形式選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">變化形式</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allForms.map(form => (
                <label
                  key={form}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.enabledForms.includes(form)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={settings.enabledForms.includes(form)}
                    onChange={(e) => {
                      const newForms = e.target.checked
                        ? [...settings.enabledForms, form]
                        : settings.enabledForms.filter(f => f !== form);
                      if (newForms.length > 0) {
                        onSettingsChange({ ...settings, enabledForms: newForms });
                      }
                    }}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">{FORM_NAMES[form]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 修飾詞選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">額外修飾詞</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={settings.enabledModifiers.polite}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    enabledModifiers: { ...settings.enabledModifiers, polite: e.target.checked }
                  })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <div>
                  <div className="font-medium text-slate-800">丁寧語 (ます形)</div>
                  <div className="text-sm text-slate-600">加入禮貌形式的變化</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={settings.enabledModifiers.negative}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    enabledModifiers: { ...settings.enabledModifiers, negative: e.target.checked }
                  })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <div>
                  <div className="font-medium text-slate-800">否定形</div>
                  <div className="text-sm text-slate-600">加入否定變化</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={settings.enabledModifiers.past}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    enabledModifiers: { ...settings.enabledModifiers, past: e.target.checked }
                  })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <div>
                  <div className="font-medium text-slate-800">過去形</div>
                  <div className="text-sm text-slate-600">加入過去時態</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-primary-200"
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
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">當前連勝</span>
        </div>
        <div className="text-3xl font-bold">{currentStreak}</div>
      </div>
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">最高連勝</span>
        </div>
        <div className="text-3xl font-bold">{maxStreak}</div>
      </div>
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">正確率</span>
        </div>
        <div className="text-3xl font-bold">{accuracy}%</div>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">總題數</span>
        </div>
        <div className="text-3xl font-bold">{totalAttempts}</div>
      </div>
    </div>
  );
}

// === 元件: 模式 A - 執行變化 ===
function PerformMode({ question, onSubmit, feedback, userAnswer }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue('');
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue);
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
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {getVerbTypeShort(question.verb.type)}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {question.verb.level}
            </span>
          </div>
          <div className="text-6xl font-bold japanese-text mb-4">{question.verb.dictionary}</div>
          <div className="text-2xl opacity-90 mb-2">{question.verb.reading}</div>
          <div className="text-lg opacity-75">{question.verb.meaning}</div>
        </div>
      </div>

      {/* 問題說明 */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-slate-200">
        <div className="text-center">
          <div className="text-sm text-slate-600 mb-2">請變化為:</div>
          <div className="text-2xl font-bold text-slate-800">
            {getQuestionDescription(question.form, question.modifiers)}
          </div>
        </div>
      </div>

      {/* 輸入區域 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={feedback !== null}
            placeholder="請輸入答案 (平假名)"
            className={`w-full text-3xl japanese-text text-center p-6 rounded-xl border-2 transition-all ${
              feedback === null
                ? 'border-slate-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                : feedback.correct
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
            } outline-none`}
            autoFocus
          />
        </div>

        {feedback === null ? (
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            提交答案
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-xl ${
              feedback.correct ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
            }`}
          >
            <div className="flex items-start gap-4">
              {feedback.correct ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className={`text-xl font-bold mb-2 ${feedback.correct ? 'text-green-800' : 'text-red-800'}`}>
                  {feedback.correct ? '正確! 太棒了!' : '答錯了,再接再厲!'}
                </div>
                {!feedback.correct && (
                  <div className="space-y-2">
                    <div className="text-slate-700">
                      <span className="font-semibold">你的答案:</span>{' '}
                      <span className="japanese-text text-lg">{userAnswer}</span>
                    </div>
                    <div className="text-slate-700">
                      <span className="font-semibold">正確答案:</span>{' '}
                      <span className="japanese-text text-lg text-green-700 font-bold">{question.answer}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}

// === 元件: 模式 B - 識別變化 ===
function RecognizeMode({ question, onSubmit, feedback }) {
  const [selectedTags, setSelectedTags] = useState({
    form: null,
    polite: false,
    negative: false,
    past: false
  });

  useEffect(() => {
    setSelectedTags({
      form: null,
      polite: false,
      negative: false,
      past: false
    });
  }, [question]);

  const allForms = Object.values(CONJUGATION_FORMS);

  const handleSubmit = () => {
    onSubmit(selectedTags);
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
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="text-center">
          <div className="text-sm font-medium opacity-80 mb-2">這是什麼變化形式?</div>
          <div className="text-6xl font-bold japanese-text mb-4">{question.answer}</div>
          <div className="flex justify-center gap-2 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {getVerbTypeShort(question.verb.type)}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {question.verb.level}
            </span>
          </div>
          <div className="text-lg opacity-75 mt-2">
            (來自: {question.verb.dictionary} - {question.verb.meaning})
          </div>
        </div>
      </div>

      {/* 選擇變化形式 */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-slate-200">
        <div className="text-sm font-semibold text-slate-700 mb-3">選擇變化形式:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {allForms.map(form => (
            <button
              key={form}
              onClick={() => setSelectedTags({ ...selectedTags, form })}
              disabled={feedback !== null}
              className={`p-3 rounded-lg border-2 transition-all font-medium ${
                selectedTags.form === form
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              } ${feedback !== null && 'cursor-not-allowed opacity-60'}`}
            >
              {FORM_NAMES[form]}
            </button>
          ))}
        </div>
      </div>

      {/* 選擇修飾詞 */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-slate-200">
        <div className="text-sm font-semibold text-slate-700 mb-3">選擇修飾詞 (可多選):</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTags({ ...selectedTags, polite: !selectedTags.polite })}
            disabled={feedback !== null}
            className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
              selectedTags.polite
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            } ${feedback !== null && 'cursor-not-allowed opacity-60'}`}
          >
            丁寧
          </button>
          <button
            onClick={() => setSelectedTags({ ...selectedTags, negative: !selectedTags.negative })}
            disabled={feedback !== null}
            className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
              selectedTags.negative
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            } ${feedback !== null && 'cursor-not-allowed opacity-60'}`}
          >
            否定
          </button>
          <button
            onClick={() => setSelectedTags({ ...selectedTags, past: !selectedTags.past })}
            disabled={feedback !== null}
            className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
              selectedTags.past
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            } ${feedback !== null && 'cursor-not-allowed opacity-60'}`}
          >
            過去
          </button>
        </div>
      </div>

      {/* 提交按鈕 */}
      {feedback === null ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedTags.form}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          提交答案
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-6 rounded-xl ${
            feedback.correct ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
          }`}
        >
          <div className="flex items-start gap-4">
            {feedback.correct ? (
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className={`text-xl font-bold mb-2 ${feedback.correct ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.correct ? '正確! 太棒了!' : '答錯了,再接再厲!'}
              </div>
              {!feedback.correct && (
                <div className="text-slate-700">
                  <span className="font-semibold">正確答案:</span>{' '}
                  <span className="text-lg font-bold text-green-700">
                    {getQuestionDescription(question.form, question.modifiers)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// === 主要 App 元件 ===
function App() {
  const [settings, setSettings] = useState({
    mode: 'perform',
    enabledForms: [
      CONJUGATION_FORMS.POLITE,
      CONJUGATION_FORMS.NEGATIVE,
      CONJUGATION_FORMS.PAST,
      CONJUGATION_FORMS.TE_FORM
    ],
    enabledLevels: ['N5', 'N4', 'N3'],
    enabledTypes: ['GODAN', 'ICHIDAN', 'IRREGULAR', 'SURU'],
    enabledModifiers: {
      polite: true,
      negative: true,
      past: true
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [stats, setStats] = useState({
    currentStreak: 0,
    maxStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0
  });

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
    const randomVerb = filteredVerbs[Math.floor(Math.random() * filteredVerbs.length)];
    const question = generateQuestion(randomVerb, settings.enabledForms, settings.enabledModifiers);
    setCurrentQuestion(question);
    setFeedback(null);
    setUserAnswer('');
  };

  // 初始化第一個問題
  useEffect(() => {
    generateNewQuestion();
  }, [filteredVerbs, settings.enabledForms]);

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

    // 3秒後自動下一題
    setTimeout(() => {
      generateNewQuestion();
    }, 3000);
  };

  // 處理答案提交 (模式 B)
  const handleRecognizeSubmit = (selectedTags) => {
    const isCorrect = (
      selectedTags.form === currentQuestion.form &&
      selectedTags.polite === (currentQuestion.modifiers.politeStyle || false) &&
      selectedTags.negative === (currentQuestion.modifiers.negative || false) &&
      selectedTags.past === (currentQuestion.modifiers.past || false)
    );

    setFeedback({ correct: isCorrect });

    // 更新統計
    setStats(prev => ({
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      maxStreak: isCorrect ? Math.max(prev.maxStreak, prev.currentStreak + 1) : prev.maxStreak,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
      totalAttempts: prev.totalAttempts + 1
    }));

    // 3秒後自動下一題
    setTimeout(() => {
      generateNewQuestion();
    }, 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 頂部導航 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">日語動詞變化練習</h1>
              <p className="text-sm text-slate-600">
                {filteredVerbs.length} 個動詞 | JLPT {settings.enabledLevels.join('/')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTutorial(true)}
                className="p-3 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors"
                title="變化教學"
              >
                <GraduationCap className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="重置統計"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 rounded-xl bg-primary-100 hover:bg-primary-200 text-primary-700 transition-colors"
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
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">沒有符合條件的動詞</h3>
            <p className="text-slate-600 mb-4">請調整設定中的 JLPT 等級或動詞類型</p>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
            >
              開啟設定
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {currentQuestion && (
              settings.mode === 'perform' ? (
                <PerformMode
                  key={`perform-${currentQuestion.verb.dictionary}-${currentQuestion.form}`}
                  question={currentQuestion}
                  onSubmit={handlePerformSubmit}
                  feedback={feedback}
                  userAnswer={userAnswer}
                />
              ) : (
                <RecognizeMode
                  key={`recognize-${currentQuestion.answer}`}
                  question={currentQuestion}
                  onSubmit={handleRecognizeSubmit}
                  feedback={feedback}
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
