# にじGTAライバーMAP

[にじGTA](https://wikiwiki.jp/nijisanji/Grand%20Theft%20Auto%E3%81%BE%E3%81%A8%E3%82%81/GTA5/%E3%81%AB%E3%81%98%E3%81%95%E3%82%93%E3%81%98GTA) での各ライバーのGTA内での位置を見れるサービスです。


## Getting Started


```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## endpoints

### `/`

アプリケーション本体。

#### parameters

| name | description | example |
|---|---|---|
| gtaDay | GTAの何日目か | gtaDay=1 |
| gtaTime | GTA内での時刻のunix timestamp | gtaTime=1718445600 |
| livers | 選択しているライバー。ライバーIDを`,`区切りでつなげた文字列 | livers=kanae,sara-hoshikawa |

### `/notice`

注意事項。

### `/credit`

クレジット。開発者情報や引用元など。