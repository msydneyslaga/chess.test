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
    exports.createboard = void 0;
    var pieceType;
    (function (pieceType) {
        pieceType[pieceType["pawn"] = 0] = "pawn";
        pieceType[pieceType["rook"] = 1] = "rook";
        pieceType[pieceType["knight"] = 2] = "knight";
        pieceType[pieceType["bishop"] = 3] = "bishop";
        pieceType[pieceType["queen"] = 4] = "queen";
        pieceType[pieceType["king"] = 5] = "king";
    })(pieceType || (pieceType = {}));
    ;
    class Piece {
        constructor(type) {
            this.type = type;
        }
    }
    ;
    class Board {
        constructor(board) {
            this.htmlboard = board;
            this.grid = [];
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++)
                    this.grid[x][y] = null;
            }
            /* make array static BACK TO YOUR PRIMITIVE PAST BITCH
             * AHHAAH THIS IS YOUR NATURAL STATE THIS IS HOW YOU'RE
             * MEANT TO BE */
            Object.seal(this.grid);
        }
        /* at this point i'll take C++ */
        initDefaultPieces() {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++)
                    this.grid[x][y] = null;
            }
        }
    }
    ;
    function createboard() {
        let board = document.getElementById("board");
        let colour = false;
        if (!board)
            throw "board not found";
        for (var y = 0; y < 8; y++) {
            const xcoord = "abcdefgh";
            const tr = document.createElement("tr");
            for (var x = 0; x < 8; x++) {
                const t = document.createElement("td");
                /* in what function universe would
                 * `if(x & 1 == 0)` produce an error?
                 * why the fuck would `&` take precedence
                 * over `==` */
                if (colour)
                    t.className = "tile black";
                else
                    t.className = "tile white";
                t.id = `TILE ${y + 1}${xcoord[x]}`;
                tr.append(t);
                /* "Type 'boolean' iis not assignable to type 'number'" 🤓
                * there is no difference there is no difference there is
                * no difference there is no difference there is no diffe */
                colour = !colour;
            }
            colour = !colour;
            board.append(tr);
        }
        return new Board(board);
    }
    exports.createboard = createboard;
});
// let print = console.log;
define("main", ["require", "exports", "chess"], function (require, exports, chess) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    chess = __importStar(chess);
    function main() {
        console.log("loaded");
        const board = chess.createboard();
        board.initDefaultPieces();
    }
    main();
});
