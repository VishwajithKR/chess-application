import React, { useState } from "react";
import CommonBox from "../components/CommonBox";
import pawn_b from "../assets/images/pawn_b.png";
import pawn_w from "../assets/images/pawn_w.png";
import knight_b from "../assets/images/knight_b.png";
import knight_w from "../assets/images/knight_w.png";
import bishop_b from "../assets/images/bishop_b.png";
import bishop_w from "../assets/images/bishop_w.png";
import king_b from "../assets/images/king_b.png";
import king_w from "../assets/images/king_w.png";
import queen_b from "../assets/images/queen_b.png";
import queen_w from "../assets/images/queen_w.png";
import rook_b from "../assets/images/rook_b.png";
import rook_w from "../assets/images/rook_w.png";
import {
  getBishopMoves,
  getKingMoves,
  getKnightMoves,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
  isKingInCheck,
  isCheckmate,
} from "../utills/iconFunction";

const ChessModule = () => {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const numbers = [8, 7, 6, 5, 4, 3, 2, 1];
  const initialBoard = [
    rook_b, knight_b, bishop_b, queen_b, king_b, bishop_b, knight_b, rook_b,
    pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w,
    rook_w, knight_w, bishop_w, queen_w, king_w, bishop_w, knight_w, rook_w,
  ];
  
  const [board, setBoard] = useState([...initialBoard]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [turn, setTurn] = useState(1);
  const [isActive, setIsActive] = useState([]);
  const [capturedWhite, setCapturedWhite] = useState([]);
  const [capturedBlack, setCapturedBlack] = useState([]);
  const [isCheck, setIsCheck] = useState("");
  const [history, setHistory] = useState([]);

  const handleClick = (index, image) => {
    console.log("1: handleClick triggered");
  
    const currentPiece = board[selectedIndex];
    const currentTurnIsWhite = turn % 2 === 1;
  
    if (
      selectedIndex !== null &&
      isActive.includes(index) &&
      selectedIndex !== index
    ) {
      console.log("2: A move is being made");
  
      const movingPiece = board[selectedIndex];
      const pieceName = movingPiece?.split("/").pop().split(".")[0];
      const pieceIsWhite = pieceName.endsWith("_w");
  
      if (pieceIsWhite !== currentTurnIsWhite) {
        console.log("3: Not the correct turn for the selected piece");
        return;
      }
  
      const newBoard = [...board];
  
      const captured = board[index];
      if (captured) {
        console.log("4: A capture is happening");
        const capturedName = captured?.split("/").pop().split(".")[0];
        if (capturedName.endsWith("_w")) {
          setCapturedWhite((prev) => [...prev, captured]);
        } else {
          setCapturedBlack((prev) => [...prev, captured]);
        }
      }
  
      console.log("5: Saving to history");
      setHistory((prev) => [
        ...prev,
        {
          board: [...board],
          turn,
          capturedWhite: [...capturedWhite],
          capturedBlack: [...capturedBlack],
        },
      ]);
  
      newBoard[index] = movingPiece;
      newBoard[selectedIndex] = null;
      setBoard(newBoard);
      setIsActive([]);
      setSelectedIndex(null);
  
      const nextTurn = turn + 1;
      setTurn(nextTurn);
  
      const isNextWhiteTurn = nextTurn % 2 === 1;
      if (isKingInCheck(newBoard, isNextWhiteTurn)) {
        console.log("6: Check detected");
        if (isCheckmate(newBoard, isNextWhiteTurn)) {
          console.log("7: Checkmate detected");
          setTimeout(() => {
            setIsCheck(`${isNextWhiteTurn ? "White" : "Black"} Game Over!`);
          }, 100);
        } else {
          console.log("8: Just a check, not checkmate");
          setTimeout(() => {
            setIsCheck(`${isNextWhiteTurn ? "White" : "Black"} is in check!`);
          }, 100);
        }
      } else {
        console.log("9: No check");
        setIsCheck("");
      }
  
      return;
    }
  
    if (image) {
      console.log("10: A piece was clicked");
  //     const name = image?.split("/").pop().split(".")[0];
  //     const isWhite = name.endsWith("_w");
  
  const nameMatch = image?.match(/([a-z]+_[bw])\.?/i); 
  const name = nameMatch ? nameMatch[1] : "";
  const isWhite = name.endsWith("_w");
  console.log(isWhite,"2222222222222222")

      if (isWhite !== currentTurnIsWhite) {
        console.log("11: Wrong player's turn");
        return;
      }
  
      let possibleMoves = [];
  
      if (name.startsWith("pawn")) {
        console.log("12: Calculating pawn moves",name);
        possibleMoves = getPawnMoves(index, board, isWhite);
      } else if (name.startsWith("knight")) {
        console.log("13: Calculating knight moves");
        possibleMoves = getKnightMoves(index, board, isWhite);
      } else if (name.startsWith("bishop")) {
        console.log("14: Calculating bishop moves");
        possibleMoves = getBishopMoves(index, board, isWhite);
      } else if (name.startsWith("rook")) {
        console.log("15: Calculating rook moves");
        possibleMoves = getRookMoves(index, board, isWhite);
      } else if (name.startsWith("queen")) {
        console.log("16: Calculating queen moves");
        possibleMoves = getQueenMoves(index, board, isWhite);
      } else if (name.startsWith("king")) {
        console.log("17: Calculating king moves");
        possibleMoves = getKingMoves(index, board, isWhite);
      }
  
      setIsActive(possibleMoves);
      setSelectedIndex(index);
    } else {
      console.log("18: Empty square clicked - clearing selection");
      setIsActive([]);
      setSelectedIndex(null);
    }
  };
  
  const handleBack = () => {
    if (history.length === 0) return;
  
    const prevState = history[history.length - 1];
    setBoard(prevState.board);
    setTurn(prevState.turn);
    setCapturedWhite(prevState.capturedWhite);
    setCapturedBlack(prevState.capturedBlack);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setSelectedIndex(null);
    setIsActive([]);
    setIsCheck("");
  };
  const handleReset = () => {
    setBoard([...initialBoard]);
    setTurn(1);
    setSelectedIndex(null);
    setIsActive([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setIsCheck("");
    setHistory([]);
  };
  

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-blue-50 select-none">
     {isCheck && <div className="absolute -top-4 left-0 right-0 text-center text-2xl font-semibold text-red-500 p-4">{isCheck}</div>}
      <h1 className="text-2xl font-bold mb-4">Ultimate Chess</h1>
      <div className="flex items-center justify-center">
        {/* Left - Captured Black Pieces */}
        <div className="w-[75px] flex flex-col gap-2 items-center">
          {capturedBlack.map((img, i) => (
            <img key={i} src={img} alt="" className="w-6 h-6" />
          ))}
        </div>

        {/* Main Board */}
        <div className="flex">
          <div className="flex flex-col justify-center mr-2">
            {numbers.map((num) => (
              <div
                key={num}
                className="h-[75px] flex items-center justify-center text-sm font-semibold"
              >
                {num}
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-8 mb-1">
              {letters.map((letter) => (
                <div
                  key={letter}
                  className="w-[75px] h-[20px] flex items-center justify-center text-sm font-semibold"
                >
                  {letter}
                </div>
              ))}
            </div>

            <div className="w-[600px] h-[600px] grid grid-cols-8 grid-rows-8 border-8 border-blue-300">
              {board.map((img, i) => (
                <CommonBox
                  key={i}
                  boxId={i}
                  img={img}
                  isActive={isActive}
                  selected={i === selectedIndex}
                  onClick={() => isCheck.includes("Game Over!") ? null : handleClick(i, img)}
                  background={
                    (Math.floor(i / 8) + (i % 8)) % 2 === 1
                      ? "bg-blue-600/20"
                      : "bg-white"
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right - Captured White Pieces */}
        <div className="w-[75px] flex flex-col gap-2 items-center">
          {capturedWhite.map((img, i) => (
            <img key={i} src={img} alt="" className="w-6 h-6" />
          ))}
        </div>
      </div>'
      <div className="flex px-2 justify-between w-[600px]">

      <button onClick={handleBack}
             className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back
      </button>

      <button onClick={handleReset}
             className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Reset
      </button>
      </div>

      <h2 className="text-xl font-semibold mb-2 mt-4">
        {turn % 2 === 1 ? "White" : "Black"} Turn
      </h2>
    </div>
  );
};

export default ChessModule;
