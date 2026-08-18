import blessed from "blessed";
import { stdin as input, stdout as output } from "node:process";

export function createGameScreen(
  playerOneCharacter,
  playerTwoCharacter,
  CPU,
  rounds,
) {
  const screen = blessed.screen({
    smartCSR: true,
    title: "Mario Kart CLI",
    input,
    output,
  });

  const round = blessed.box({
    top: 0,
    left: 0,
    width: "100%",
    height: 3,
    content: `RODADA 1 / ${rounds}`,
    align: "center",
    valign: "middle",
    tags: true,
    border: {
      type: "line",
    },
  });

  screen.append(round);

  const playerOne = blessed.box({
    top: 3,
    left: 0,
    width: "50%",
    height: "100%-3",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
  });

  const playerTwo = blessed.box({
    top: 3,
    left: "50%",
    width: "50%",
    height: "100%-3",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
  });

  screen.append(playerOne);
  screen.append(playerTwo);

  const playerOneName = blessed.box({
    top: 5,
    left: 0,
    width: "50%",
    height: 1,
    content: `PLAYER 1 (${playerOneCharacter})`,
    align: "center",
  });

  const playerOneScore = blessed.box({
    top: 6,
    left: 0,
    width: "50%",
    height: 1,
    content: "Pontos: 0",
    align: "center",
  });

  const playerTwoName = blessed.box({
    top: 5,
    left: "50%",
    width: "50%",
    height: 1,
    content: `${CPU ? "CPU" : "PLAYER 2"} (${playerTwoCharacter})`,
    align: "center",
  });

  const playerTwoScore = blessed.box({
    top: 6,
    left: "50%",
    width: "50%",
    height: 1,
    content: "Pontos: 0",
    align: "center",
  });

  screen.append(playerOneName);
  screen.append(playerOneScore);
  screen.append(playerTwoName);
  screen.append(playerTwoScore);

  const playerOneDice = blessed.box({
    top: 8,
    left: "25%-4",
    width: 9,
    height: 5,
    content: "1",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
  });

  const playerTwoDice = blessed.box({
    top: 8,
    left: "75%-4",
    width: 9,
    height: 5,
    content: "1",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
  });

  screen.append(playerOneDice);
  screen.append(playerTwoDice);

  const playerOneHistory = blessed.box({
    top: 15,
    left: 0,
    width: "50%",
    height: 8,
    content: "HISTORICO\n",
    align: "center",
  });

  const playerTwoHistory = blessed.box({
    top: 15,
    left: "50%",
    width: "50%",
    height: 8,
    content: "HISTORICO\n",
    align: "center",
  });

  screen.append(playerOneHistory);
  screen.append(playerTwoHistory);

  const roundResult = blessed.box({
    bottom: 1,
    left: "25%",
    width: "50%",
    height: 3,
    content: "",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
    hidden: true,
  });

  screen.append(roundResult);

  const PlayerOneRoundNotify = blessed.box({
    bottom: 1,
    left: "0%",
    width: "45%",
    height: 3,
    content: "Sua vez de jogar! Pressione SPACE para rolar o dado.",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
    hidden: true,
  });

  screen.append(PlayerOneRoundNotify);

  const PlayerTwoRoundNotify = blessed.box({
    bottom: 1,
    left: "55%",
    width: "45%",
    height: 3,
    content: CPU? "Computador está jogando! Aguarde por favor." :"Sua vez de jogar! Pressione SPACE para rolar o dado.",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
    hidden: true,
  });

  screen.append(PlayerTwoRoundNotify);

  const notification = blessed.box({
    top: "45%",
    left: "25%",
    width: "50%",
    height: 5,
    content: "",
    align: "center",
    valign: "middle",
    border: {
      type: "line",
    },
    hidden: true,
  });

  screen.append(notification);

  screen.render();

  screen.key(["q", "C", "c"], () => {
    process.exit(0);
  });

  return {
    screen,
    round,
    playerOneScore,
    playerTwoScore,
    playerOneDice,
    playerTwoDice,
    playerOneHistory,
    playerTwoHistory,
    roundResult,
    PlayerOneRoundNotify,
    PlayerTwoRoundNotify,
    notification
  };
}

export function waitForKey(screen) {
  return new Promise((resolve) => {
    screen.onceKey(["space"], (ch, key) => {
      resolve(key.name);
    });
  });
}
