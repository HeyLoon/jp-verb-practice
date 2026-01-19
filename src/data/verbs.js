// 日語動詞資料庫 - JLPT N5-N3 等級 + 日常用語
// 動詞類型: GODAN (五段動詞/u-verb), ICHIDAN (一段動詞/ru-verb), IRREGULAR (不規則動詞)
// level: N5, N4, N3, DAILY (日常常用)

export const verbs = [
  // ==========================================
  // 不規則動詞 (Irregular) - 只有兩個
  // ==========================================
  { dictionary: 'する', reading: 'する', meaning: '做', type: 'IRREGULAR', level: 'N5' },
  { dictionary: '来る', reading: 'くる', meaning: '來', type: 'IRREGULAR', level: 'N5' },

  // ==========================================
  // 一段動詞 (Ichidan / ru-verb) - N5
  // ==========================================
  { dictionary: '食べる', reading: 'たべる', meaning: '吃', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '見る', reading: 'みる', meaning: '看', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '寝る', reading: 'ねる', meaning: '睡覺', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '起きる', reading: 'おきる', meaning: '起床', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '出る', reading: 'でる', meaning: '出去', type: 'ICHIDAN', level: 'N5' },
  { dictionary: 'いる', reading: 'いる', meaning: '在(有生命)', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '着る', reading: 'きる', meaning: '穿(上半身)', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '浴びる', reading: 'あびる', meaning: '淋浴', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '開ける', reading: 'あける', meaning: '打開', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '閉める', reading: 'しめる', meaning: '關閉', type: 'ICHIDAN', level: 'N5' },
  { dictionary: '教える', reading: 'おしえる', meaning: '教', type: 'ICHIDAN', level: 'N5' },

  // ==========================================
  // 一段動詞 (Ichidan) - N4
  // ==========================================
  { dictionary: '覚える', reading: 'おぼえる', meaning: '記住', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '忘れる', reading: 'わすれる', meaning: '忘記', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '始める', reading: 'はじめる', meaning: '開始', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '降りる', reading: 'おりる', meaning: '下車', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '借りる', reading: 'かりる', meaning: '借入', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '捨てる', reading: 'すてる', meaning: '扔掉', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '疲れる', reading: 'つかれる', meaning: '疲累', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '答える', reading: 'こたえる', meaning: '回答', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '届ける', reading: 'とどける', meaning: '送達', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '集める', reading: 'あつめる', meaning: '收集', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '調べる', reading: 'しらべる', meaning: '調查', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '負ける', reading: 'まける', meaning: '輸', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '逃げる', reading: 'にげる', meaning: '逃跑', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '伝える', reading: 'つたえる', meaning: '傳達', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '見せる', reading: 'みせる', meaning: '給...看', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '考える', reading: 'かんがえる', meaning: '思考', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '止める', reading: 'とめる', meaning: '停止', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '続ける', reading: 'つづける', meaning: '繼續', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '決める', reading: 'きめる', meaning: '決定', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '比べる', reading: 'くらべる', meaning: '比較', type: 'ICHIDAN', level: 'N4' },
  { dictionary: '混ぜる', reading: 'まぜる', meaning: '混合', type: 'ICHIDAN', level: 'N4' },

  // ==========================================
  // 一段動詞 (Ichidan) - N3
  // ==========================================
  { dictionary: '信じる', reading: 'しんじる', meaning: '相信', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '感じる', reading: 'かんじる', meaning: '感覺', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '落ちる', reading: 'おちる', meaning: '掉落', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '過ぎる', reading: 'すぎる', meaning: '經過/過度', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '生きる', reading: 'いきる', meaning: '活著', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '足りる', reading: 'たりる', meaning: '足夠', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '慣れる', reading: 'なれる', meaning: '習慣', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '増える', reading: 'ふえる', meaning: '增加', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '減る', reading: 'へる', meaning: '減少', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '換える', reading: 'かえる', meaning: '交換', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '受ける', reading: 'うける', meaning: '接受', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '述べる', reading: 'のべる', meaning: '陳述', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '与える', reading: 'あたえる', meaning: '給予', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '求める', reading: 'もとめる', meaning: '追求/要求', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '認める', reading: 'みとめる', meaning: '承認', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '進める', reading: 'すすめる', meaning: '推進', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '加える', reading: 'くわえる', meaning: '添加', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '含める', reading: 'ふくめる', meaning: '包含', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '抑える', reading: 'おさえる', meaning: '抑制', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '避ける', reading: 'さける', meaning: '避開', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '並べる', reading: 'ならべる', meaning: '排列', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '眺める', reading: 'ながめる', meaning: '眺望', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '育てる', reading: 'そだてる', meaning: '培育', type: 'ICHIDAN', level: 'N3' },
  { dictionary: '分ける', reading: 'わける', meaning: '分開', type: 'ICHIDAN', level: 'N3' },

  // ==========================================
  // 五段動詞 (Godan) - う結尾 - N5
  // ==========================================
  { dictionary: '買う', reading: 'かう', meaning: '買', type: 'GODAN', level: 'N5' },
  { dictionary: '会う', reading: 'あう', meaning: '見面', type: 'GODAN', level: 'N5' },
  { dictionary: '言う', reading: 'いう', meaning: '說', type: 'GODAN', level: 'N5' },
  { dictionary: '歌う', reading: 'うたう', meaning: '唱歌', type: 'GODAN', level: 'N5' },
  { dictionary: '洗う', reading: 'あらう', meaning: '洗', type: 'GODAN', level: 'N5' },
  { dictionary: '使う', reading: 'つかう', meaning: '使用', type: 'GODAN', level: 'N5' },
  { dictionary: '思う', reading: 'おもう', meaning: '想', type: 'GODAN', level: 'N5' },

  // ==========================================
  // 五段動詞 - う結尾 - N4/N3
  // ==========================================
  { dictionary: '払う', reading: 'はらう', meaning: '付款', type: 'GODAN', level: 'N4' },
  { dictionary: '笑う', reading: 'わらう', meaning: '笑', type: 'GODAN', level: 'N4' },
  { dictionary: '習う', reading: 'ならう', meaning: '學習', type: 'GODAN', level: 'N4' },
  { dictionary: '拾う', reading: 'ひろう', meaning: '撿起', type: 'GODAN', level: 'N4' },
  { dictionary: '違う', reading: 'ちがう', meaning: '不同', type: 'GODAN', level: 'N4' },
  { dictionary: '手伝う', reading: 'てつだう', meaning: '幫忙', type: 'GODAN', level: 'N4' },
  { dictionary: '向かう', reading: 'むかう', meaning: '前往', type: 'GODAN', level: 'N3' },
  { dictionary: '誘う', reading: 'さそう', meaning: '邀請', type: 'GODAN', level: 'N3' },
  { dictionary: '狙う', reading: 'ねらう', meaning: '瞄準', type: 'GODAN', level: 'N3' },
  { dictionary: '追う', reading: 'おう', meaning: '追趕', type: 'GODAN', level: 'N3' },
  { dictionary: '扱う', reading: 'あつかう', meaning: '處理', type: 'GODAN', level: 'N3' },
  { dictionary: '伺う', reading: 'うかがう', meaning: '拜訪(敬語)', type: 'GODAN', level: 'N3' },

  // ==========================================
  // 五段動詞 - つ結尾 - N5/N4/N3
  // ==========================================
  { dictionary: '待つ', reading: 'まつ', meaning: '等待', type: 'GODAN', level: 'N5' },
  { dictionary: '持つ', reading: 'もつ', meaning: '持有', type: 'GODAN', level: 'N5' },
  { dictionary: '立つ', reading: 'たつ', meaning: '站立', type: 'GODAN', level: 'N5' },
  { dictionary: '勝つ', reading: 'かつ', meaning: '贏', type: 'GODAN', level: 'N4' },
  { dictionary: '打つ', reading: 'うつ', meaning: '打', type: 'GODAN', level: 'N4' },
  { dictionary: '育つ', reading: 'そだつ', meaning: '成長', type: 'GODAN', level: 'N3' },
  { dictionary: '経つ', reading: 'たつ', meaning: '(時間)經過', type: 'GODAN', level: 'N3' },
  { dictionary: '役立つ', reading: 'やくだつ', meaning: '有用', type: 'GODAN', level: 'N3' },

  // ==========================================
  // 五段動詞 - る結尾 - N5
  // ==========================================
  { dictionary: '帰る', reading: 'かえる', meaning: '回家', type: 'GODAN', level: 'N5' },
  { dictionary: '走る', reading: 'はしる', meaning: '跑', type: 'GODAN', level: 'N5' },
  { dictionary: '入る', reading: 'はいる', meaning: '進入', type: 'GODAN', level: 'N5' },
  { dictionary: '分かる', reading: 'わかる', meaning: '明白', type: 'GODAN', level: 'N5' },
  { dictionary: '作る', reading: 'つくる', meaning: '製作', type: 'GODAN', level: 'N5' },
  { dictionary: '売る', reading: 'うる', meaning: '賣', type: 'GODAN', level: 'N5' },
  { dictionary: '座る', reading: 'すわる', meaning: '坐', type: 'GODAN', level: 'N5' },
  { dictionary: '乗る', reading: 'のる', meaning: '乘坐', type: 'GODAN', level: 'N5' },
  { dictionary: '終わる', reading: 'おわる', meaning: '結束', type: 'GODAN', level: 'N5' },
  { dictionary: 'ある', reading: 'ある', meaning: '在(無生命)', type: 'GODAN', level: 'N5' },
  { dictionary: '撮る', reading: 'とる', meaning: '拍攝', type: 'GODAN', level: 'N5' },
  { dictionary: '取る', reading: 'とる', meaning: '拿取', type: 'GODAN', level: 'N5' },
  { dictionary: '送る', reading: 'おくる', meaning: '送', type: 'GODAN', level: 'N5' },
  { dictionary: '曲がる', reading: 'まがる', meaning: '轉彎', type: 'GODAN', level: 'N5' },
  { dictionary: '止まる', reading: 'とまる', meaning: '停止', type: 'GODAN', level: 'N5' },

  // ==========================================
  // 五段動詞 - る結尾 - N4
  // ==========================================
  { dictionary: '登る', reading: 'のぼる', meaning: '攀登', type: 'GODAN', level: 'N4' },
  { dictionary: '渡る', reading: 'わたる', meaning: '渡過', type: 'GODAN', level: 'N4' },
  { dictionary: '通る', reading: 'とおる', meaning: '通過', type: 'GODAN', level: 'N4' },
  { dictionary: '戻る', reading: 'もどる', meaning: '返回', type: 'GODAN', level: 'N4' },
  { dictionary: '太る', reading: 'ふとる', meaning: '變胖', type: 'GODAN', level: 'N4' },
  { dictionary: '困る', reading: 'こまる', meaning: '困擾', type: 'GODAN', level: 'N4' },
  { dictionary: '代わる', reading: 'かわる', meaning: '代替', type: 'GODAN', level: 'N4' },
  { dictionary: '決まる', reading: 'きまる', meaning: '決定(自動)', type: 'GODAN', level: 'N4' },
  { dictionary: '変わる', reading: 'かわる', meaning: '改變', type: 'GODAN', level: 'N4' },
  { dictionary: '集まる', reading: 'あつまる', meaning: '聚集', type: 'GODAN', level: 'N4' },
  { dictionary: '始まる', reading: 'はじまる', meaning: '開始(自動)', type: 'GODAN', level: 'N4' },
  { dictionary: '掛かる', reading: 'かかる', meaning: '花費/掛', type: 'GODAN', level: 'N4' },
  { dictionary: '上がる', reading: 'あがる', meaning: '上升', type: 'GODAN', level: 'N4' },
  { dictionary: '下がる', reading: 'さがる', meaning: '下降', type: 'GODAN', level: 'N4' },

  // ==========================================
  // 五段動詞 - る結尾 - N3
  // ==========================================
  { dictionary: '守る', reading: 'まもる', meaning: '守護', type: 'GODAN', level: 'N3' },
  { dictionary: '残る', reading: 'のこる', meaning: '剩餘', type: 'GODAN', level: 'N3' },
  { dictionary: '限る', reading: 'かぎる', meaning: '限制', type: 'GODAN', level: 'N3' },
  { dictionary: '配る', reading: 'くばる', meaning: '分發', type: 'GODAN', level: 'N3' },
  { dictionary: '祈る', reading: 'いのる', meaning: '祈禱', type: 'GODAN', level: 'N3' },
  { dictionary: '握る', reading: 'にぎる', meaning: '握住', type: 'GODAN', level: 'N3' },
  { dictionary: '頼る', reading: 'たよる', meaning: '依賴', type: 'GODAN', level: 'N3' },
  { dictionary: '折る', reading: 'おる', meaning: '折疊', type: 'GODAN', level: 'N3' },
  { dictionary: '図る', reading: 'はかる', meaning: '謀求', type: 'GODAN', level: 'N3' },
  { dictionary: '測る', reading: 'はかる', meaning: '測量', type: 'GODAN', level: 'N3' },
  { dictionary: '計る', reading: 'はかる', meaning: '計算', type: 'GODAN', level: 'N3' },
  { dictionary: '眠る', reading: 'ねむる', meaning: '睡眠', type: 'GODAN', level: 'N3' },
  { dictionary: '怒る', reading: 'おこる', meaning: '生氣', type: 'GODAN', level: 'N3' },
  { dictionary: '張る', reading: 'はる', meaning: '貼/伸展', type: 'GODAN', level: 'N3' },
  { dictionary: '散る', reading: 'ちる', meaning: '散落', type: 'GODAN', level: 'N3' },
  { dictionary: '移る', reading: 'うつる', meaning: '移動', type: 'GODAN', level: 'N3' },
  { dictionary: '写る', reading: 'うつる', meaning: '映照', type: 'GODAN', level: 'N3' },
  { dictionary: '至る', reading: 'いたる', meaning: '到達', type: 'GODAN', level: 'N3' },

  // ==========================================
  // 五段動詞 - く結尾 - N5
  // ==========================================
  { dictionary: '書く', reading: 'かく', meaning: '寫', type: 'GODAN', level: 'N5' },
  { dictionary: '聞く', reading: 'きく', meaning: '聽/問', type: 'GODAN', level: 'N5' },
  { dictionary: '行く', reading: 'いく', meaning: '去', type: 'GODAN', level: 'N5' },
  { dictionary: '歩く', reading: 'あるく', meaning: '走路', type: 'GODAN', level: 'N5' },
  { dictionary: '働く', reading: 'はたらく', meaning: '工作', type: 'GODAN', level: 'N5' },
  { dictionary: '泣く', reading: 'なく', meaning: '哭', type: 'GODAN', level: 'N5' },
  { dictionary: '置く', reading: 'おく', meaning: '放置', type: 'GODAN', level: 'N5' },
  { dictionary: '弾く', reading: 'ひく', meaning: '彈奏', type: 'GODAN', level: 'N5' },
  { dictionary: '引く', reading: 'ひく', meaning: '拉', type: 'GODAN', level: 'N5' },
  { dictionary: '開く', reading: 'あく', meaning: '打開(自動)', type: 'GODAN', level: 'N5' },
  { dictionary: '届く', reading: 'とどく', meaning: '送達(自動)', type: 'GODAN', level: 'N5' },

  // ==========================================
  // 五段動詞 - く結尾 - N4/N3
  // ==========================================
  { dictionary: '動く', reading: 'うごく', meaning: '移動', type: 'GODAN', level: 'N4' },
  { dictionary: '焼く', reading: 'やく', meaning: '烤/燒', type: 'GODAN', level: 'N4' },
  { dictionary: '着く', reading: 'つく', meaning: '到達', type: 'GODAN', level: 'N4' },
  { dictionary: '続く', reading: 'つづく', meaning: '持續', type: 'GODAN', level: 'N4' },
  { dictionary: '吹く', reading: 'ふく', meaning: '吹', type: 'GODAN', level: 'N4' },
  { dictionary: '空く', reading: 'あく', meaning: '空閒', type: 'GODAN', level: 'N4' },
  { dictionary: '抱く', reading: 'だく', meaning: '抱', type: 'GODAN', level: 'N3' },
  { dictionary: '描く', reading: 'えがく', meaning: '描繪', type: 'GODAN', level: 'N3' },
  { dictionary: '驚く', reading: 'おどろく', meaning: '驚訝', type: 'GODAN', level: 'N3' },
  { dictionary: '磨く', reading: 'みがく', meaning: '磨/刷', type: 'GODAN', level: 'N3' },
  { dictionary: '輝く', reading: 'かがやく', meaning: '閃耀', type: 'GODAN', level: 'N3' },
  { dictionary: '築く', reading: 'きずく', meaning: '建築', type: 'GODAN', level: 'N3' },
  { dictionary: '導く', reading: 'みちびく', meaning: '引導', type: 'GODAN', level: 'N3' },
  { dictionary: '招く', reading: 'まねく', meaning: '招待', type: 'GODAN', level: 'N3' },
  { dictionary: '省く', reading: 'はぶく', meaning: '省略', type: 'GODAN', level: 'N3' },

  // ==========================================
  // 五段動詞 - ぐ結尾 - N5/N4/N3
  // ==========================================
  { dictionary: '泳ぐ', reading: 'およぐ', meaning: '游泳', type: 'GODAN', level: 'N5' },
  { dictionary: '脱ぐ', reading: 'ぬぐ', meaning: '脫(衣服)', type: 'GODAN', level: 'N5' },
  { dictionary: '急ぐ', reading: 'いそぐ', meaning: '急忙', type: 'GODAN', level: 'N4' },
  { dictionary: '騒ぐ', reading: 'さわぐ', meaning: '吵鬧', type: 'GODAN', level: 'N3' },
  { dictionary: '注ぐ', reading: 'そそぐ', meaning: '注入', type: 'GODAN', level: 'N3' },
  { dictionary: '防ぐ', reading: 'ふせぐ', meaning: '防禦', type: 'GODAN', level: 'N3' },
  { dictionary: '繋ぐ', reading: 'つなぐ', meaning: '連接', type: 'GODAN', level: 'N3' },

  // ==========================================
  // 五段動詞 - す結尾 - N5
  // ==========================================
  { dictionary: '話す', reading: 'はなす', meaning: '說話', type: 'GODAN', level: 'N5' },
  { dictionary: '出す', reading: 'だす', meaning: '拿出', type: 'GODAN', level: 'N5' },
  { dictionary: '渡す', reading: 'わたす', meaning: '交給', type: 'GODAN', level: 'N5' },
  { dictionary: '貸す', reading: 'かす', meaning: '借出', type: 'GODAN', level: 'N5' },
  { dictionary: '押す', reading: 'おす', meaning: '推/按', type: 'GODAN', level: 'N5' },
  { dictionary: '消す', reading: 'けす', meaning: '關掉/消除', type: 'GODAN', level: 'N5' },
  { dictionary: '返す', reading: 'かえす', meaning: '歸還', type: 'GODAN', level: 'N5' },
  { dictionary: '無くす', reading: 'なくす', meaning: '弄丟', type: 'GODAN', level: 'N5' },

  // ==========================================
  // 五段動詞 - す結尾 - N4/N3
  // ==========================================
  { dictionary: '直す', reading: 'なおす', meaning: '修理', type: 'GODAN', level: 'N4' },
  { dictionary: '落とす', reading: 'おとす', meaning: '掉落(他動)', type: 'GODAN', level: 'N4' },
  { dictionary: '起こす', reading: 'おこす', meaning: '叫醒', type: 'GODAN', level: 'N4' },
  { dictionary: '倒す', reading: 'たおす', meaning: '推倒', type: 'GODAN', level: 'N4' },
  { dictionary: '外す', reading: 'はずす', meaning: '取下', type: 'GODAN', level: 'N4' },
  { dictionary: '壊す', reading: 'こわす', meaning: '破壞', type: 'GODAN', level: 'N4' },
  { dictionary: '殺す', reading: 'ころす', meaning: '殺', type: 'GODAN', level: 'N3' },
  { dictionary: '探す', reading: 'さがす', meaning: '尋找', type: 'GODAN', level: 'N4' },
  { dictionary: '動かす', reading: 'うごかす', meaning: '移動(他動)', type: 'GODAN', level: 'N4' },
  { dictionary: '回す', reading: 'まわす', meaning: '旋轉(他動)', type: 'GODAN', level: 'N4' },
  { dictionary: '表す', reading: 'あらわす', meaning: '表達', type: 'GODAN', level: 'N3' },
  { dictionary: '示す', reading: 'しめす', meaning: '顯示', type: 'GODAN', level: 'N3' },
  { dictionary: '果たす', reading: 'はたす', meaning: '完成', type: 'GODAN', level: 'N3' },
  { dictionary: '流す', reading: 'ながす', meaning: '沖走', type: 'GODAN', level: 'N3' },
  { dictionary: '減らす', reading: 'へらす', meaning: '減少(他動)', type: 'GODAN', level: 'N3' },
  { dictionary: '増やす', reading: 'ふやす', meaning: '增加(他動)', type: 'GODAN', level: 'N3' },
  { dictionary: '指す', reading: 'さす', meaning: '指向', type: 'GODAN', level: 'N3' },
  { dictionary: '刺す', reading: 'さす', meaning: '刺', type: 'GODAN', level: 'N3' },

  // ==========================================
  // 五段動詞 - ぬ結尾 (只有一個)
  // ==========================================
  { dictionary: '死ぬ', reading: 'しぬ', meaning: '死', type: 'GODAN', level: 'N5' },

  // ==========================================
  // 五段動詞 - ぶ結尾 - N5/N4/N3
  // ==========================================
  { dictionary: '遊ぶ', reading: 'あそぶ', meaning: '玩', type: 'GODAN', level: 'N5' },
  { dictionary: '飛ぶ', reading: 'とぶ', meaning: '飛', type: 'GODAN', level: 'N5' },
  { dictionary: '呼ぶ', reading: 'よぶ', meaning: '叫', type: 'GODAN', level: 'N5' },
  { dictionary: '選ぶ', reading: 'えらぶ', meaning: '選擇', type: 'GODAN', level: 'N4' },
  { dictionary: '運ぶ', reading: 'はこぶ', meaning: '搬運', type: 'GODAN', level: 'N4' },
  { dictionary: '並ぶ', reading: 'ならぶ', meaning: '排隊', type: 'GODAN', level: 'N4' },
  { dictionary: '学ぶ', reading: 'まなぶ', meaning: '學習', type: 'GODAN', level: 'N3' },
  { dictionary: '結ぶ', reading: 'むすぶ', meaning: '綁/結', type: 'GODAN', level: 'N3' },
  { dictionary: '叫ぶ', reading: 'さけぶ', meaning: '叫喊', type: 'GODAN', level: 'N3' },

  // ==========================================
  // 五段動詞 - む結尾 - N5/N4/N3
  // ==========================================
  { dictionary: '読む', reading: 'よむ', meaning: '讀', type: 'GODAN', level: 'N5' },
  { dictionary: '飲む', reading: 'のむ', meaning: '喝', type: 'GODAN', level: 'N5' },
  { dictionary: '住む', reading: 'すむ', meaning: '居住', type: 'GODAN', level: 'N5' },
  { dictionary: '休む', reading: 'やすむ', meaning: '休息', type: 'GODAN', level: 'N5' },
  { dictionary: '頼む', reading: 'たのむ', meaning: '請求', type: 'GODAN', level: 'N4' },
  { dictionary: '込む', reading: 'こむ', meaning: '擁擠', type: 'GODAN', level: 'N4' },
  { dictionary: '盗む', reading: 'ぬすむ', meaning: '偷', type: 'GODAN', level: 'N4' },
  { dictionary: '進む', reading: 'すすむ', meaning: '前進', type: 'GODAN', level: 'N4' },
  { dictionary: '楽しむ', reading: 'たのしむ', meaning: '享受', type: 'GODAN', level: 'N4' },
  { dictionary: '苦しむ', reading: 'くるしむ', meaning: '痛苦', type: 'GODAN', level: 'N3' },
  { dictionary: '悩む', reading: 'なやむ', meaning: '煩惱', type: 'GODAN', level: 'N3' },
  { dictionary: '望む', reading: 'のぞむ', meaning: '希望', type: 'GODAN', level: 'N3' },
  { dictionary: '含む', reading: 'ふくむ', meaning: '包含(自動)', type: 'GODAN', level: 'N3' },
  { dictionary: '沈む', reading: 'しずむ', meaning: '沉沒', type: 'GODAN', level: 'N3' },
  { dictionary: '産む', reading: 'うむ', meaning: '生產', type: 'GODAN', level: 'N3' },
  { dictionary: '組む', reading: 'くむ', meaning: '組合', type: 'GODAN', level: 'N3' },
  { dictionary: '済む', reading: 'すむ', meaning: '結束', type: 'GODAN', level: 'N3' },

  // ==========================================
  // サ行變格動詞 (する複合動詞) - 常用
  // ==========================================
  { dictionary: '勉強する', reading: 'べんきょうする', meaning: '學習', type: 'SURU', level: 'N5' },
  { dictionary: '料理する', reading: 'りょうりする', meaning: '烹飪', type: 'SURU', level: 'N5' },
  { dictionary: '掃除する', reading: 'そうじする', meaning: '打掃', type: 'SURU', level: 'N5' },
  { dictionary: '洗濯する', reading: 'せんたくする', meaning: '洗衣服', type: 'SURU', level: 'N5' },
  { dictionary: '散歩する', reading: 'さんぽする', meaning: '散步', type: 'SURU', level: 'N5' },
  { dictionary: '買い物する', reading: 'かいものする', meaning: '購物', type: 'SURU', level: 'N5' },
  { dictionary: '旅行する', reading: 'りょこうする', meaning: '旅行', type: 'SURU', level: 'N5' },
  { dictionary: '結婚する', reading: 'けっこんする', meaning: '結婚', type: 'SURU', level: 'N5' },
  { dictionary: '心配する', reading: 'しんぱいする', meaning: '擔心', type: 'SURU', level: 'N4' },
  { dictionary: '準備する', reading: 'じゅんびする', meaning: '準備', type: 'SURU', level: 'N4' },
  { dictionary: '説明する', reading: 'せつめいする', meaning: '說明', type: 'SURU', level: 'N4' },
  { dictionary: '紹介する', reading: 'しょうかいする', meaning: '介紹', type: 'SURU', level: 'N4' },
  { dictionary: '運転する', reading: 'うんてんする', meaning: '駕駛', type: 'SURU', level: 'N4' },
  { dictionary: '運動する', reading: 'うんどうする', meaning: '運動', type: 'SURU', level: 'N4' },
  { dictionary: '練習する', reading: 'れんしゅうする', meaning: '練習', type: 'SURU', level: 'N4' },
  { dictionary: '予約する', reading: 'よやくする', meaning: '預約', type: 'SURU', level: 'N4' },
  { dictionary: '確認する', reading: 'かくにんする', meaning: '確認', type: 'SURU', level: 'N3' },
  { dictionary: '参加する', reading: 'さんかする', meaning: '參加', type: 'SURU', level: 'N3' },
  { dictionary: '成功する', reading: 'せいこうする', meaning: '成功', type: 'SURU', level: 'N3' },
  { dictionary: '失敗する', reading: 'しっぱいする', meaning: '失敗', type: 'SURU', level: 'N3' },
  { dictionary: '経験する', reading: 'けいけんする', meaning: '經驗', type: 'SURU', level: 'N3' },
  { dictionary: '相談する', reading: 'そうだんする', meaning: '商量', type: 'SURU', level: 'N3' },
  { dictionary: '注意する', reading: 'ちゅういする', meaning: '注意', type: 'SURU', level: 'N3' },
  { dictionary: '利用する', reading: 'りようする', meaning: '利用', type: 'SURU', level: 'N3' },
  { dictionary: '発表する', reading: 'はっぴょうする', meaning: '發表', type: 'SURU', level: 'N3' },
  { dictionary: '連絡する', reading: 'れんらくする', meaning: '聯絡', type: 'SURU', level: 'N3' },
  { dictionary: '影響する', reading: 'えいきょうする', meaning: '影響', type: 'SURU', level: 'N3' },
  { dictionary: '反対する', reading: 'はんたいする', meaning: '反對', type: 'SURU', level: 'N3' },
  { dictionary: '賛成する', reading: 'さんせいする', meaning: '贊成', type: 'SURU', level: 'N3' },
  { dictionary: '感動する', reading: 'かんどうする', meaning: '感動', type: 'SURU', level: 'N3' },
];

// 依 JLPT 等級分類
export const verbsByLevel = {
  N5: verbs.filter(v => v.level === 'N5'),
  N4: verbs.filter(v => v.level === 'N4'),
  N3: verbs.filter(v => v.level === 'N3'),
};

// 依動詞類型分類
export const verbsByType = {
  GODAN: verbs.filter(v => v.type === 'GODAN'),
  ICHIDAN: verbs.filter(v => v.type === 'ICHIDAN'),
  IRREGULAR: verbs.filter(v => v.type === 'IRREGULAR'),
  SURU: verbs.filter(v => v.type === 'SURU'),
};

export default verbs;
