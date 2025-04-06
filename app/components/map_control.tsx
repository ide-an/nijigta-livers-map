export default function MapControl() {
  return (
  <div>
      {/* 日付選択 */}
      <label>日付:
        <select>
          <option value="1">Day 1(6/15)</option>
          <option value="2">Day 2(6/16)</option>
          <option value="3">Day 3(6/17)</option>
          <option value="4">Day 4(6/18)</option>
          <option value="5">Day 5(6/19)</option>
          <option value="6">Day 6(6/20)</option>
          <option value="7">Day 7(6/21)</option>
          <option value="8">Day 8(6/22)</option>
          <option value="9">Day 9(6/23)</option>
          <option value="10">Day 10(6/24)</option>
        </select>
      </label>


      {/* 時刻表示 */}
      <div>2024-06-14 19:23:45</div>

      {/* 再生・停止 */}
      <div>
        <input type="range" min="0" max="100" className="w-full" />
      </div>
      <div>
        <button>先頭に戻る</button>
        <button>再生/停止</button>
        <button>最後に飛ぶ</button>
        <label>再生速度:
          <select>
            <option>x1</option>
            <option>x60</option>
            <option>x300</option>
          </select>
        </label>
      </div>

      {/* 表示オプション */}
      <div>
        <label>ルートを表示: <input type="checkbox" /></label>
      </div>

      {/* ライバー選択 */}
      <div>
        <div><button>ライバー選択</button></div>
        <div>
          <span>[アイコン]</span>
          <span>叶</span>
          <span>手動補正済み</span>
        </div>
        <div>
          <span>[アイコン]</span>
          <span>星川サラ</span>
          <span>手動補正済み</span>
        </div>
        <div>
          <span>[アイコン]</span>
          <span>月ノ美兎</span>
          <span>!補正前</span>
        </div>
        <div>
          <span>[アイコン]</span>
          <span>樋口楓</span>
          <span>!補正前</span>
        </div>
        <div>
          <span>[アイコン]</span>
          <span>える</span>
          <span>!補正前</span>
        </div>
        <div>
          <span>[アイコン]</span>
          <span>渋谷ハジメ</span>
          <span>!補正前</span>
        </div>
        <div>
          <span>[アイコン]</span>
          <span>剣持刀也</span>
          <span>!補正前</span>
        </div>
        <div>
          <span>[アイコン]</span>
          <span>伏見ガク</span>
          <span>!補正前</span>
        </div>
        <div>
          <span>[アイコン]</span>
          <span>夕陽リリ</span>
          <span>!補正前</span>
        </div>
      </div>
    </div>
  );
}