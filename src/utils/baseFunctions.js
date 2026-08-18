export function rollDice(sides = 6, gameScreen, player) {
  const result = Math.floor(Math.random() * sides) + 1;

  return new Promise((resolve) => {
    const visualRoll = setInterval(() => {
      if (player === 1) {
        gameScreen.playerOneDice.setContent(
          `${Math.floor(Math.random() * 6) + 1}`,
        );
      }

      if (player === 2) {
        gameScreen.playerTwoDice.setContent(
          `${Math.floor(Math.random() * 6) + 1}`,
        );
      }

      gameScreen.screen.render();
    }, 100);

    setTimeout(() => {
      clearInterval(visualRoll);

      if (player === 1) {
        gameScreen.playerOneDice.setContent(`${result}`);
      }

      if (player === 2) {
        gameScreen.playerTwoDice.setContent(`${result}`);
      }

      gameScreen.screen.render();

      resolve(result);
    }, 2000);
  });
}

export function getRandomCircuit() {
  let circuits = ["Reta", "Curva", "Confronto"];

  return circuits[Math.floor(Math.random() * circuits.length)];
}

export function getPlayerRoundResult(character, circuit, diceRoll) {
  const { name, speed, handling, power } = character;

  if (circuit === "Reta") {
    return speed + diceRoll;
  } else if (circuit === "Curva") {
    return handling + diceRoll;
  } else if (circuit === "Confronto") {
    return power + diceRoll;
  }
}

export function getwinner(
  playerOneResult,
  playerTwoResult,
  playerOnePoints,
  playerTwoPoints,
  circuit,
) {
  let winner = playerOneResult > playerTwoResult ? 1 : 2;

  if (playerOneResult == playerTwoResult) winner = 0;

  if (winner === 1) {
    playerOnePoints++;
    if (circuit === "Confronto")
      playerTwoPoints > 0 ? playerTwoPoints-- : (playerTwoPoints = 0);
  } else if (winner === 2) {
    playerTwoPoints++;
    if (circuit === "Confronto")
      playerOnePoints > 0 ? playerOnePoints-- : (playerOnePoints = 0);
  }

  return {
    winner,
    playerOnePoints,
    playerTwoPoints,
  };
}

export function getArgs() {
  const { argv } = process;

  const LocalPlayer2 =
    Boolean(argv.indexOf("-p2") > -1) || Boolean(argv.indexOf("-P2") > -1);

  const customRoundsIndex =
    process.argv.indexOf("-R") !== -1
      ? process.argv.indexOf("-R")
      : process.argv.indexOf("-r");
  let customRoundsValue;

  if (customRoundsIndex > -1) {
    customRoundsValue = process.argv[customRoundsIndex + 1];
  }

  const Rounds = parseInt(customRoundsValue, 10) || 5;

  return {
    Player2: LocalPlayer2 ? "Local Player" : "CPU",
    Rounds: Rounds,
  };
}

export const wait = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export function historyDisplay(historyArray) {
  return [
    "HISTÓRICO",
    "",
    ...historyArray.slice(-5).map((item) => {
      const status = item.winner ? "✅" : "❌";

      return `R${item.round} | ${item.circuit} | Dado: ${item.diceRoll} | ${item.result} ${status}`;
    }),
  ];
}
