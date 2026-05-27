# クレアメディカル株式会社 コーポレートサイト

医療現場のDXを加速する医療用アプリの開発・販売と、医療・ヘルスケア領域のスタートアップ支援を行う**クレアメディカル株式会社**のコーポレートサイト一式です。

---

## ファイル構成

```
creamedical/
├── index.html            # トップページ（全1ページ構成）
├── css/
│   └── style.css         # スタイル定義
├── js/
│   └── main.js           # ナビゲーション・スクロール・フォーム制御
├── images/
│   ├── hero.jpg          # メインビジュアル
│   ├── service-medical.jpg
│   ├── service-startup.jpg
│   └── ceo-message.jpg
├── DESIGN_DOCUMENT.md    # 設計思想・コンサル提案書
└── README.md             # 本ファイル
```

## 動作確認方法

1. `index.html` をブラウザで直接開く
2. もしくは下記コマンドでローカルサーバー起動：
   ```bash
   python3 -m http.server 8000
   # → http://localhost:8000 にアクセス
   ```

## 主要機能

- ✅ レスポンシブデザイン（PC / タブレット / スマートフォン対応）
- ✅ 固定ヘッダー・スムーススクロール
- ✅ スクロール連動アニメーション（IntersectionObserver）
- ✅ Googleマップ埋め込み
- ✅ HTML5バリデーション付きお問い合わせフォーム
- ✅ 主要パートナー10社への外部リンク（target="_blank" + rel="noopener"）
- ✅ SEO/OGPメタタグ設定済み
- ✅ アクセシビリティ配慮（aria属性・コントラスト確保）

## カラーパレット

| 用途 | カラーコード | 役割 |
|------|---|---|
| メインカラー | `#0B3D91` | 医療の信頼感・知性 |
| アクセントカラー | `#00B6E3` | ITの先進性・躍進 |
| サブアクセント | `#14E0B1` | 成長・健やかさ |
| ベースカラー | `#F7FBFD` / `#FFFFFF` | 清潔感・余白 |
| テキスト | `#1A2540` | 視認性・上品さ |

## カスタマイズ手順

### お問い合わせフォーム送信先の設定

`js/main.js` の Form Submit セクションを編集してください。

```js
// 例: fetch APIで送信
fetch('/api/contact', {
  method:'POST',
  body: new FormData(form)
})
.then(res => res.json())
.then(() => { success.hidden = false; });
```

代替として、Formspree、Google Forms、AWS SES、SendGridなどの外部サービスとの連携を推奨します。

### 代表者写真の差し替え

`images/ceo-message.jpg` を実際の伏見様のお写真に差し替えてください（推奨：縦長 4:5 比率、800×1000px以上）。

### Googleマップの住所表示精度

ビル名まで正確にピン表示させたい場合、Google Maps Platform の Embed API を取得して `iframe` の `src` に Place ID を指定してください。

---

© CREA MEDICAL Inc. All Rights Reserved.
