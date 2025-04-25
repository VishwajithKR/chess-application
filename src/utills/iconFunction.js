export const isCheckmate = (board, isWhiteTurn) => {
  for (let i = 0; i < board.length; i++) {
    const piece = board[i];
    if (!piece) continue;

    const isWhite = piece.includes("_w");
    if (isWhite !== isWhiteTurn) continue;

    const name = piece.split("/").pop().split(".")[0];
    let possibleMoves = [];

    if (name.startsWith("pawn")) {
      possibleMoves = getPawnMoves(i, board, isWhite);
    } else if (name.startsWith("knight")) {
      possibleMoves = getKnightMoves(i, board, isWhite);
    } else if (name.startsWith("bishop")) {
      possibleMoves = getBishopMoves(i, board, isWhite);
    } else if (name.startsWith("rook")) {
      possibleMoves = getRookMoves(i, board, isWhite);
    } else if (name.startsWith("queen")) {
      possibleMoves = getQueenMoves(i, board, isWhite);
    } else if (name.startsWith("king")) {
      possibleMoves = getKingMoves(i, board, isWhite);
    }

    for (let move of possibleMoves) {
      const tempBoard = [...board];
      tempBoard[move] = tempBoard[i];
      tempBoard[i] = null;
      if (!isKingInCheck(tempBoard, isWhiteTurn)) {
        return false; // Found at least one legal move to avoid check
      }
    }
  }

  return true; // No move prevents check => checkmate
};


export const isKingInCheck = (board, isWhiteTurn) => {
  const kingPiece = isWhiteTurn ? "king_w" : "king_b";
  const kingIndex = board.findIndex(
    (piece) => piece && piece.includes(kingPiece)
  );
  if (kingIndex === -1) return false;

  for (let i = 0; i < board.length; i++) {
    const piece = board[i];
    if (!piece) continue;

    const isWhite = piece.includes("_w");
    if (isWhite === isWhiteTurn) continue;

    const name = piece.split("/").pop().split(".")[0];

    let moves = [];
    if (name.startsWith("pawn")) {
      moves = getPawnMoves(i, board, !isWhiteTurn, true); // attackOnly flag
    } else if (name.startsWith("knight")) {
      moves = getKnightMoves(i, board, !isWhiteTurn);
    } else if (name.startsWith("bishop")) {
      moves = getBishopMoves(i, board, !isWhiteTurn);
    } else if (name.startsWith("rook")) {
      moves = getRookMoves(i, board, !isWhiteTurn);
    } else if (name.startsWith("queen")) {
      moves = getQueenMoves(i, board, !isWhiteTurn);
    } else if (name.startsWith("king")) {
      moves = getKingMoves(i, board, !isWhiteTurn);
    }

    if (moves.includes(kingIndex)) return true;
  }

  return false;
};


export const getBishopMoves = (index, board, isWhite) => {
  const moves = [];
  const directions = [-9, -7, 7, 9]; // Diagonal directions
  
  for (let dir of directions) {
    let curr = index;

    while (true) {
      const next = curr + dir;

      // Check if the next position is out of bounds (either too low or too high)
      if (next < 0 || next >= 64) break;

      // Ensure no column wraparound: for example, a bishop can't move from column 'a' to column 'h' diagonally
      const currColumn = curr % 8;
      const nextColumn = next % 8;
      if (Math.abs(currColumn - nextColumn) > 1) break; // If the column difference is more than 1, break

      const target = board[next];

      if (target) {
        const targetName = target.split("/").pop().split(".")[0];
        const isTargetWhite = targetName.endsWith("_w");

        // If the target is a friendly piece (same color), stop moving
        if (isTargetWhite === isWhite) {
          break; // Can't move beyond friendly pieces
        }

        // If the target is an enemy piece, we can capture it
        if (isTargetWhite !== isWhite) {
          moves.push(next); // Add to available moves (capture)
        }
        break; // Stop further movement in this direction
      }

      moves.push(next); // Add the empty square to available moves
      curr = next; // Move to the next square along the diagonal
    }
  }

  return moves;
};


  

  export const getKnightMoves = (index, board, isWhite) => {
    const moves = [];
    const row = Math.floor(index / 8);
    const col = index % 8;
  
    // All 8 possible knight move offsets (row, col)
    const offsets = [
      [-2, -1], [-2, +1],
      [-1, -2], [-1, +2],
      [+1, -2], [+1, +2],
      [+2, -1], [+2, +1],
    ];
  
    for (const [dr, dc] of offsets) {
      const newRow = row + dr;
      const newCol = col + dc;
  
      // Check if the new position is within board boundaries
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const newIndex = newRow * 8 + newCol;
        const targetPiece = board[newIndex];
  
        // Allow move if target is empty or contains an enemy piece
        if (!targetPiece || isWhite !== targetPiece.includes("_w")) {
          moves.push(newIndex);
        }
      }
    }
  
    return moves;
  };

  
  export const getPawnMoves = (index, board, isWhite, attackOnly = false) => {
    const direction = isWhite ? -8 : 8;
    const moves = [];
  
    const row = Math.floor(index / 8);
    const col = index % 8;
  
    // Attack diagonally
    const attackOffsets = isWhite ? [-9, -7] : [7, 9];
    attackOffsets.forEach((offset) => {
      const targetIndex = index + offset;
      if (
        targetIndex >= 0 &&
        targetIndex < 64 &&
        Math.abs((targetIndex % 8) - col) === 1
      ) {
        const target = board[targetIndex];
        if (attackOnly || (target && (isWhite ? target.includes("_b") : target.includes("_w")))) {
          moves.push(targetIndex);
        }
      }
    });
  
    if (attackOnly) return moves;
  
    // Move forward
    const frontOne = index + direction;
    if (!board[frontOne]) {
      moves.push(frontOne);
      // First double move
      const frontTwo = index + direction * 2;
      const isInitialRow = isWhite ? row === 6 : row === 1;
      if (isInitialRow && !board[frontTwo]) {
        moves.push(frontTwo);
      }
    }
  
    return moves;
  };
  

  export const getRookMoves = (index, board, isWhite) => {
    const moves = [];
    const directions = [-1, 1, -8, 8]; // left, right, up, down
    const row = Math.floor(index / 8);
  
    for (const direction of directions) {
      let i = index + direction;
  
      while (i >= 0 && i < 64) {
        const iRow = Math.floor(i / 8);
        const iCol = i % 8;
        const currRow = Math.floor(i / 8);
        const currCol = i % 8;
  
        // Prevent rook from wrapping around rows
        if (
          direction === -1 && iCol === 7 ||
          direction === 1 && iCol === 0
        ) break;
  
        const target = board[i];
  
        if (!target) {
          moves.push(i);
        } else {
          if (isWhite !== target.includes("_w")) {
            moves.push(i); // Capture
          }
          break; // Blocked
        }
  
        i += direction;
      }
    }
  
    return moves;
  };
  

export const getQueenMoves = (index, board, isWhite) => {
  const bishopMoves = getBishopMoves(index, board, isWhite);
  const rookMoves = getRookMoves(index, board, isWhite);
  return [...bishopMoves, ...rookMoves];
};

export const getKingMoves = (index, board, isWhite) => {
  const moves = [];
  const directions = [-9, -8, -7, -1, 1, 7, 8, 9]; // All directions around the king
  const row = Math.floor(index / 8);
  const col = index % 8;

  for (let dir of directions) {
    const target = index + dir;
    const targetRow = Math.floor(target / 8);
    const targetCol = target % 8;

    // Make sure the move stays within the board and only 1 square away
    if (
      target >= 0 &&
      target < 64 &&
      Math.abs(targetRow - row) <= 1 &&
      Math.abs(targetCol - col) <= 1
    ) {
      const targetPiece = board[target];
      const targetName = targetPiece?.split("/").pop().split(".")[0];
      const targetIsWhite = targetName?.endsWith("_w");

      // Allow move if square is empty or contains enemy piece
      if (!targetPiece || targetIsWhite !== isWhite) {
        moves.push(target);
      }
    }
  }

  return moves;
};

export const getPieceInfo = (imgPath) => {
  const match = imgPath?.match(/([a-z]+_[bw])\.?/i);
  const name = match ? match[1] : "";
  const isWhite = name.endsWith("_w");
  return { name, isWhite };
};


