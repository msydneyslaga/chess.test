// let print = console.log;

import * as chess from "./chess";

function main(): void
{
	console.log("loaded");

	const board = new chess.Board(8, 8);
	board.initDefaultPieces();
	board.draw();
}

main();

