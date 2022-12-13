enum pieceType
{
	pawn,
	rook,
	knight,
	bishop,
	queen,
	king,
};

class Piece
{
	readonly type: pieceType;
	colour: pieceType;

	constructor(type: pieceType)
	{
		this.type = type;
	}
};

const defaultlayout: (Piece | null)[] =
[
	Piece
];

class Board
{
	private htmlboard: HTMLElement;
	private grid: (Piece | null)[][];

	constructor(board: HTMLElement)
	{
		this.htmlboard = board;

		this.grid = [];
		for(let y = 0; y < 8; y++)
		{
			for(let x = 0; x < 8; x++)
				this.grid[x][y] = null;
		}

		/* make array static BACK TO YOUR PRIMITIVE PAST BITCH
		 * AHHAAH THIS IS YOUR NATURAL STATE THIS IS HOW YOU'RE
		 * MEANT TO BE */
		Object.seal(this.grid);
	}

	/* at this point i'll take C++ */
	initDefaultPieces(): void
	{
		for(let y = 0; y < 8; y++)
		{
			for(let x = 0; x < 8; x++)
				this.grid[x][y] = null;
		}
	}
};

export function createboard(): Board
{
	let board = document.getElementById("board");
	let colour = false;

	if(!board)
		throw "board not found";

	for(var y = 0; y < 8; y++)
	{
		const xcoord = "abcdefgh"
		const tr = document.createElement("tr");

		for(var x = 0; x < 8; x++)
		{
			const t = document.createElement("td");

			/* in what function universe would
			 * `if(x & 1 == 0)` produce an error?
			 * why the fuck would `&` take precedence
			 * over `==` */
			if(colour)
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

