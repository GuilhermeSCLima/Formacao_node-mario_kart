import blessed from "blessed";
import { stdin as input, stdout as output } from "node:process";

export function createFinalScreen({
  playerOneCharacter,
  playerTwoCharacter,
  playerOneScore,
  playerTwoScore,
  playerOneHistory,
  playerTwoHistory,
  winner,
}) {
  const screen = blessed.screen({
    smartCSR: true,
    title: "Mario Kart CLI - Resultado",
    input,
    output,
  });

  const finalScreen = blessed.box({
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: {
      type: "line",
    },
  });

  const title = blessed.box({
    top: 1,
    left: 0,
    width: "100%",
    height: 3,
    content: "🏁  FIM DE JOGO  🏁",
    align: "center",
    valign: "middle",
    bold: true,
  });

  const winnerBox = blessed.box({
    top: 5,
    left: "20%",
    width: "60%",
    height: 6,
    content: "",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
  });

  const playerOnePanel = blessed.box({
    top: 12,
    left: 0,
    width: "50%",
    height: "50%",
    content: "",
    align: "center",
    border: {
      type: "line",
    },
  });

  const playerTwoPanel = blessed.box({
    top: 12,
    left: "50%",
    width: "50%",
    height: "50%",
    content: "",
    align: "center",
    border: {
      type: "line",
    },
  });

  const controls = blessed.box({
    bottom: 1,
    left: 0,
    width: "100%",
    height: 3,
    content: "Q → SAIR",
    align: "center",
    valign: "middle",
  });

  const winnerName =
    winner === 1
      ? `🏆 PLAYER 1 (${playerOneCharacter.name})`
      : winner === 2
        ? `🏆 PLAYER 2 (${playerTwoCharacter.name})`
        : "🏆 EMPATE 🏆";

  const winnerScore =
    winner === 1
      ? playerOneScore
      : winner === 2
        ? playerTwoScore
        : `${playerOneScore} x ${playerTwoScore}`;

  winnerBox.setContent(`${winnerName}\n\n${winnerScore} PONTOS`);

  playerOnePanel.setContent(
    [
      `PLAYER 1 (${playerOneCharacter.name})`,
      "",
      `Pontuação: ${playerOneScore}`,
      "",
      "HISTÓRICO",
      "",
      ...playerOneHistory.map(entry => (
        `R${entry.round} - Pista ${entry.circuit} - Venceu? ${entry.winner? "Sim": "Não"}`
      )),
    ].join("\n"),
  );

  playerTwoPanel.setContent(
    [
      `PLAYER 2 (${playerTwoCharacter.name})`,
      "",
      `Pontuação: ${playerTwoScore}`,
      "",
      "HISTÓRICO",
      "",
      ...playerTwoHistory.map(entry => (
        `R${entry.round} - Pista ${entry.circuit} - Venceu? ${entry.winner? "Sim": "Não"}`
      )),
    ].join("\n"),
  );

  finalScreen.append(title);
  finalScreen.append(winnerBox);
  finalScreen.append(playerOnePanel);
  finalScreen.append(playerTwoPanel);
  finalScreen.append(controls);

  screen.append(finalScreen);

  screen.key(["q", "C-c"], () => {
    screen.destroy();
    process.exit(0);
  });

  screen.render();

  return {
    screen,
    winnerBox,
    playerOnePanel,
    playerTwoPanel,
    controls,
  };
}
