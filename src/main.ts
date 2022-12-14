// let print = console.log;

import * as chess from "./chess";

function main(): void
{
	console.log("loaded");

	const board = chess.createboard();
	board.initDefaultPieces();
	board.draw();
}

main();

