import { Canvas2DUtility } from "./canvas2d"
import { Marks } from "./marks"

//キーの押下状態を調べるためのオブジェクト
window.isKeyDown = {};

(() => {
    //Canvas2D API をラップしたユーティリティクラス
    let util: Canvas2DUtility = null;
    //描画対象となる Canvas Element
    let canvas: HTMLCanvasElement = null;
    //Canvas2D API のコンテキスト
    let ctx: CanvasRenderingContext2D = null;

    let mainRequestID: number = null;

    //canvas の幅
    const CANVAS_WIDTH = 400;
    //canvas の高さ
    const CANVAS_HEIGHT = 400;
    //マス目の数(8x8)
    const GRID_NUM = 3;

    //マス目1つのpixelサイズ
    let grid_size = CANVAS_HEIGHT / GRID_NUM;


    //石のインスタンス
    let marks: Marks = null;


    //ページのロードが完了したときに発火する load イベント
    window.addEventListener('load', () => {
        // ユーティリティクラスを初期化
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
        // ユーティリティクラスから canvas を取得
        canvas = util.canvas;
        // ユーティリティクラスから 2d コンテキストを取得
        ctx = util.context;
        // canvas の大きさを設定
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        //マークのインスタンスを作成
        marks = new Marks(util, GRID_NUM, grid_size);

        // イベントを設定する
        eventsetting();
        //ループ処理
        update();
    }, false);


    //イベントを設定する
    function eventsetting() {
        // キーの押下時に呼び出されるイベントリスナーを設定する
        window.addEventListener('keydown', (event) => {
            // キーの押下状態を管理するオブジェクトに押下されたことを設定する
            window.isKeyDown[`key_${event.key}`] = true;
            //スペースの場合
            if (event.key === ' ') {
                // キーの押下状態を管理するオブジェクトに押下されたことを設定する
                window.isKeyDown['key_space'] = true;
                console.log('スペースキー押されてるよ');
            }
        }, false);

        // キーが離された時に呼び出されるイベントリスナーを設定する
        window.addEventListener('keyup', (event) => {
            // キーが離されたことを設定する
            window.isKeyDown[`key_${event.key}`] = false;
            //スペースの場合
            if (event.key === ' ') {
                // キーの押下状態を管理するオブジェクトに押下されたことを設定する
                window.isKeyDown['key_space'] = false;
            }
        }, false);

    }

    //盤面を描画
    function draw_board() {
        // 画面を背景色で塗りつぶす
        util.drawFillRect(0, 0, canvas.width, canvas.height, "white");

        //盤面の線を描画
        for (let i = 0; i <= GRID_NUM; i++) {
            util.drawLine(0, grid_size * i, CANVAS_HEIGHT, grid_size * i, "black");
            util.drawLine(grid_size * i, 0, grid_size * i, CANVAS_HEIGHT, "black");
        }
    }

    //処理を行う
    function update() {
        //ゲーム実行
        // グローバルなアルファを必ず 1.0 で描画処理を開始する
        ctx.globalAlpha = 1.0;
        //盤を描画
        draw_board();
        //石の処理
        marks.update();

        // 恒常ループのために描画処理を再帰呼出しする
        mainRequestID = requestAnimationFrame(update);
    }


})();
