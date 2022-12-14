// let print = console.log;

import * as chess from "./chess";

function main(): void
{
	console.log("loaded");

	const container = document.getElementById("board-container");
	const board = new chess.Board(8, 8);

	if(!container)
		throw 'no container';

	container.append(board.html);
	board.initDefaultPieces();
	board.draw();
}

main();

