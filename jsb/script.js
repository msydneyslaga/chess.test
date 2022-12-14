var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define("chess", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTile = exports.xy2tileID = exports.Board = void 0;
    ;
    let nf_piece_icons = [];
    nf_piece_icons[0 /* pieceType.pawn */] = String.fromCharCode(0xe261);
    nf_piece_icons[1 /* pieceType.rook */] = String.fromCharCode(0xe263);
    nf_piece_icons[2 /* pieceType.knight */] = String.fromCharCode(0xe25f);
    nf_piece_icons[3 /* pieceType.bishop */] = String.fromCharCode(0xe29c);
    nf_piece_icons[4 /* pieceType.queen */] = String.fromCharCode(0xe262);
    nf_piece_icons[5 /* pieceType.king */] = String.fromCharCode(0xe260);
    Object.freeze(nf_piece_icons);
    class Piece {
        constructor(type, isWhite, x, y) {
            this._xpos = -1;
            this._ypos = -1;
            this.type = type;
            this.isWhite = isWhite;
            this.xpos = x;
            this.ypos = y;
        }
        get icon() {
            return nf_piece_icons[this.type];
        }
        set xpos(n) { this._xpos = n; }
        set ypos(n) { this._ypos = n; }
        get xpos() { return this._xpos; }
        get ypos() { return this._ypos; }
        move(tile) {
            if (!tile)
                throw `missing tile at ${xy2tileID(this.xpos, this.ypos)}`;
            tile.innerText = `${this.icon}`;
            tile.style.color = this.isWhite ? "var(--cat-blue)" : "var(--cat-maroon)";
            tile.onclick = this.promptMove;
            tile.style.cursor = "pointer";
        }
        promptMove() {
            this.promptTile();
            return null;
        }
        promptTile() {
            switch (this.type) {
                case 0 /* pieceType.pawn */:
                    {
                        break;
                    }
            }
        }
    }
    ;
    const defaultlayout = [
        [[1 /* pieceType.rook */, false], [2 /* pieceType.knight */, false], [3 /* pieceType.bishop */, false], [4 /* pieceType.queen */, false], [5 /* pieceType.king */, false], [3 /* pieceType.bishop */, false], [2 /* pieceType.knight */, false], [1 /* pieceType.rook */, false],],
        [[0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false],],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        [[0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true],],
        [[1 /* pieceType.rook */, true], [2 /* pieceType.knight */, true], [3 /* pieceType.bishop */, true], [4 /* pieceType.queen */, true], [5 /* pieceType.king */, true], [3 /* pieceType.bishop */, true], [2 /* pieceType.knight */, true], [1 /* pieceType.rook */, true],],
    ];
    class Board {
        constructor(width = 8, height = 8) {
            this.pieces = [];
            const boardbg = document.createElement("div");
            const board = document.createElement("table");
            let colour = false;
            boardbg.style.textAlign = "center";
            boardbg.style.margin = "0 auto";
            boardbg.style.height = "80vh";
            boardbg.style.aspectRatio = `${width} / ${height}`;
            boardbg.style.backgroundColor = "var(--cat-crust)";
            boardbg.style.color = "var(--cat-base)";
            board.style.width = "100%";
            board.style.aspectRatio = `${width} / ${height}`;
            for (var y = 0; y < height; y++) {
                const tr = document.createElement("tr");
                tr.style.height = `${Math.floor(100 / height)}%`;
                tr.style.width = "100%";
                for (var x = 0; x < width; x++) {
                    const t = document.createElement("td");
                    /* in what function universe would
                     * `if(x & 1 == 0)` produce an error?
                     * why the fuck would `&` take precedence
                     * over `==` */
                    if (colour)
                        t.className = "tile black";
                    else
                        t.className = "tile white";
                    t.id = xy2tileID(x, y);
                    tr.append(t);
                    /* "Type 'boolean' iis not assignable to type 'number'" 🤓
                    * there is no difference there is no difference there is
                    * no difference there is no difference there is no diffe */
                    colour = !colour;
                }
                colour = !colour;
                board.append(tr);
            }
            boardbg.append(board);
            document.body.append(boardbg);
            this.htmlboard = boardbg;
        }
        /* now you've got me missing C++
         *
         * why cant i neatly implement
         * functions outside of the class
         * definition?? */
        initDefaultPieces() {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const p = defaultlayout[y][x];
                    if (p != null)
                        this.pieces.push(new Piece(p[0], p[1], x, y));
                }
            }
        }
        draw() {
            this.pieces.forEach(function (p) {
                console.log(p);
                if (inBoardBounds(p.xpos, p.ypos)) {
                    const tile = getTile(p.xpos, p.ypos);
                    p.move(tile);
                }
            });
        }
    }
    exports.Board = Board;
    ;
    function xy2tileID(x, y) {
        const xcoord = "abcdefgh";
        return `TILE ${xcoord[x]}${y + 1}`;
    }
    exports.xy2tileID = xy2tileID;
    function getTile(x, y) {
        return document.getElementById(xy2tileID(x, y));
    }
    exports.getTile = getTile;
    function inBoardBounds(x, y) {
        return (x < 8) && (y < 8);
    }
});
// let print = console.log;
define("main", ["require", "exports", "chess"], function (require, exports, chess) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    chess = __importStar(chess);
    function main() {
        console.log("loaded");
        const board = new chess.Board(8, 8);
        board.initDefaultPieces();
        board.draw();
    }
    main();
});
