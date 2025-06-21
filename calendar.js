class Calendar {
    /**
     * カレンダーインスタンスを作成
     * @param {number} [month] - 月（1-12、省略時は現在の月）
     */
    constructor(month) {
        // 現在の日時を取得
        this.now = new Date();

        // month があったら month を使って Date オブジェクトを作成 なければ現在の日付で Date オブジェクトを作成
        const targetDate = month
            ? new Date(this.now.getFullYear(), month - 1, this.now.getDate())
            : this.now;

        this.year = targetDate.getFullYear();
        this.month = targetDate.getMonth();
        this.date = targetDate.getDate();
        this.day = targetDate.getDay();
    }

    /**
     * 曜日の略称を返すメソッド
     * @returns {string} スペース区切りの曜日略称文字列 ("Su Mo Tu We Th Fr Sa")
     */
    disWeek() {
        const week = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return week.join(' ');
    }

    /**
     * 指定された月の最終日（日付）を取得するメソッド
     * @param {number} [month=this.month] - 最終日を取得したい月（0-11）
     * @returns {number} 指定された月の最終日（1-31）
     */
    lastDate(month = this.month) {
        const lastDate = new Date(this.year, month + 1, 0);
        return lastDate.getDate();
    }

    /**
     * 指定された月の初日の曜日を取得するメソッド
     * @param {number} [month=this.month] - 対象月（0-11）
     * @returns {number} 指定された月の初日の曜日のインデックス（0-6）
     */
    firstDay(month = this.month) {
        const firstDay = new Date(this.year, month, 1);
        return firstDay.getDay();
    }

    /**
     * カレンダー表示用の空白文字数を計算するメソッド
     * @param {number} day - 曜日のインデックス（0-6）
     * @returns {number} 空白文字数
     */
    space(day) {
        // 初日の曜日によって空白の数を返すメソッド
        return day * 3;
    }

    /**
     * カレンダーの日付部分を表示するメソッド
     * @param {number} lastDate - その月の最終日
     * @param {number} [month=this.month] - 表示する月（0-11）
     */
    dates(lastDate, month = this.month) {
        // 初日から最終日までループ
        for (let d = 1; d <= lastDate; d++) {
            const day = new Date(this.year, month, d);
            const dayOfWeek = day.getDay();
            
            if (d === 1) {
                // 初日の場合：曜日による空白を設定
                const spaces = this.space(dayOfWeek);
                process.stdout.write(' '.repeat(spaces) + this._formatDate(d));
            } else {
                // 2日目以降
                process.stdout.write(this._formatDate(d));
            }
            
            // 土曜日の場合は改行
            if (dayOfWeek === 6) {
                console.log();
            }
        }
        
        // forループ終了後に必ず改行
        console.log();
    }

    /**
     * 日付を適切な形式でフォーマットする
     * @param {number} date - 日付
     * @returns {string} フォーマットされた日付文字列
     * @private
     */
    _formatDate(date) {
        return date < 10 ? ` ${date} ` : `${date} `;
    }
}

// コマンドライン引数の処理
const option = process.argv[2];
const month = process.argv[3];

try {
    // オプションの検証
    if (option && option !== '-m') {
        throw new Error('引数が違います。[-m]のみ使用可能です。');
    }
    
    // 月の検証
    if (month !== undefined) {
        const monthNum = parseInt(month);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            throw new Error('月を指定する引数は 1~12 にしてください。');
        }
    }

    // カレンダーの表示
    const calendar = new Calendar(month ? parseInt(month) : undefined);
    const lastDate = calendar.lastDate();
    
    console.log(`      ${calendar.month + 1}月 ${calendar.year}`);
    console.log(calendar.disWeek());
    calendar.dates(lastDate);
    
} catch (e) {
    console.error("エラー：", e.message);
}
