import { Canvas2DUtility } from "./canvas2d"
//石の位置(x, y)
class Coord {
    x: number;
    y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    //値を格納する
    set(x: number, y: number) {
        if (x != null) { this.x = x; }
        if (y != null) { this.y = y; }
    }
}


export class Marks {
    util: Canvas2DUtility;

    mark: Array<Array<string>>;
    //マス目の一辺の数
    grid_num: number;

    //1マスのpixelサイズ
    grid_size: number;

    //マークのpixelサイズ
    mark_radius: number;

    //カーソル位置(マス目)
    cursor_pos: Coord;

    input: KeyStatus;

    constructor(util: Canvas2DUtility, grid_num: number, grid_size: number) {
        this.util = util;

        //mark[y][x]
        this.mark = Array.from(new Array(grid_num), () => new Array(grid_num).fill("n"));

        this.grid_num = grid_num;
        this.grid_size = grid_size;
        //直径はマス目の80%の大きさとする
        this.mark_radius = grid_size * 0.8 * 0.5;
        //入力のインスタンス
        this.input = new KeyStatus();
        //カーソルは最初左上に置く
        this.cursor_pos = new Coord(0, 0);
        //test
        this.mark[0][0] = "o";
        this.mark[1][1] = "x";
    }

    update() {
        //キー入力からカーソルを移動させる
        this.cursor_pos = this.input.update(this.cursor_pos);
        //はみ出した場合は反対側へループさせる
        if (this.cursor_pos.x < 0) this.cursor_pos.x = this.grid_num - 1;
        if (this.cursor_pos.x >= this.grid_num) this.cursor_pos.x = 0;
        if (this.cursor_pos.y < 0) this.cursor_pos.y = this.grid_num - 1;
        if (this.cursor_pos.y >= this.grid_num) this.cursor_pos.y = 0;

        this.draw();
    }

    //マークとカーソルマスを描画
    draw() {
        for (let y = 0; y < this.grid_num; ++y) {
            for (let x = 0; x < this.grid_num; ++x) {
                this.draw_mark(x, y, this.mark[y][x],
                    x == this.cursor_pos.x && y == this.cursor_pos.y);
            }
        }
    }

    //指定されたマス目のマークを描画
    //on_cursor カーソルが自身の場所にあるか
    draw_mark(x: number, y: number, mark: string, on_cursor: boolean) {
        //カーソルがあれば周りを線で囲む
        if (on_cursor) {
            this.util.drawRectOutline(x * this.grid_size, y * this.grid_size, this.grid_size, this.grid_size, "red");
        }

        //指定されたマス目の中心座標
        let center_x = (0.5 + x) * this.grid_size;
        let center_y = (0.5 + y) * this.grid_size;

        if (mark == "o") {
            //丸
            this.util.drawCircle(center_x, center_y, this.mark_radius, "black", false);
        } else if (mark == "x") {
            //バツ
            this.util.drawLine(center_x - this.mark_radius, center_y - this.mark_radius, center_x + this.mark_radius, center_y + this.mark_radius, "black");
            this.util.drawLine(center_x - this.mark_radius, center_y + this.mark_radius, center_x + this.mark_radius, center_y - this.mark_radius, "black");
        }
    }
}

//キー入力
class KeyStatus {
    up: number;
    down: number;
    left: number;
    right: number;
    //キー長押し時の連続処理に時間を置く
    interval_time: number;

    constructor() {
        //キー長押し時の連続処理の間隔(フレーム数)
        this.up = this.interval_time;
        this.down = this.interval_time;
        this.left = this.interval_time;
        this.right = this.interval_time;
        this.interval_time = 20;
    }

    //入力されたキーからカーソルの移動方向を決める
    //長押ししたときは一定時間は何もしない
    //キーを離したときはインターバル時間で初期化することでキー入力直後に反応させる
    update(cursor_pos: Coord): Coord {
        if (window.isKeyDown.key_w || window.isKeyDown.key_ArrowUp) {
            if (this.up >= this.interval_time) {
                cursor_pos.y = cursor_pos.y - 1;
                this.up = 0;
            } else {
                ++this.up;
            }
        } else {
            this.up = this.interval_time;
        }
        if (window.isKeyDown.key_s || window.isKeyDown.key_ArrowDown) {
            if (this.down >= this.interval_time) {
                cursor_pos.y = cursor_pos.y + 1;
                this.down = 0;
            } else {
                ++this.down;
            }
        } else {
            this.down = this.interval_time;
        }
        if (window.isKeyDown.key_a || window.isKeyDown.key_ArrowLeft) {
            if (this.left >= this.interval_time) {
                cursor_pos.x = cursor_pos.x - 1;
                this.left = 0;
            } else {
                ++this.left;
            }
        } else {
            this.left = this.interval_time;
        }
        if (window.isKeyDown.key_d || window.isKeyDown.key_ArrowRight) {
            if (this.right >= this.interval_time) {
                cursor_pos.x = cursor_pos.x + 1;
                this.right = 0;
            } else {
                ++this.right;
            }
        } else {
            this.right = this.interval_time;
        }
        return cursor_pos;
    }
}

