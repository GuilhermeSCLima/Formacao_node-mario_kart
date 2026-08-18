import { argv } from "node:process";
import { characters } from "./data/characters.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  getArgs,
  getPlayerRoundResult,
  getRandomCircuit,
  getwinner,
  historyDisplay,
  rollDice,
  wait,
} from "./utils/baseFunctions.js";
import { chooseCharacters } from "./utils/chooseCharacters.js";
import { createGameScreen, waitForKey } from "./ui/gameScreen.js";
import { createFinalScreen } from "./ui/finalScreen.js";

const rl = readline.createInterface({ input, output });

async function main() {
  const { Player2, Rounds } = getArgs();

  console.log(`Iniciando a corrida com ${Rounds} voltas...`);

  const { playerOneCharacterIndex, playerTwoCharacterIndex } =
    await chooseCharacters(Player2 === "CPU", rl);

  console.log(
    `Jogador 1 escolheu: ${characters[playerOneCharacterIndex].name}`,
  );
  console.log(
    `Jogador 2 escolheu: ${characters[playerTwoCharacterIndex].name}`,
  );

  rl.close();

  const gameScreen = createGameScreen(
    characters[playerOneCharacterIndex].name,
    characters[playerTwoCharacterIndex].name,
    Player2 === "CPU",
    Rounds,
  );

  let actualRound = 0;
  let playerOnePoints = 0;
  let playerTwoPoints = 0;

  let historyPlayerOne = [];
  let historyPlayerTwo = [];

  for (let round = 1; round <= Rounds; round++) {
    actualRound = round;

    const circuit = getRandomCircuit();
    gameScreen.round.setContent(
      `RODADA ${round} / ${Rounds}\nPista: ${circuit}`,
    );

    gameScreen.notification.setContent(`Pista ${circuit}!`);
    gameScreen.notification.show();
    gameScreen.screen.render();
    await wait(2);
    gameScreen.notification.hide();
    gameScreen.screen.render();

    const updatedHistoryOne = historyDisplay(historyPlayerOne).join("\n");
    const updatedHistoryTwo = historyDisplay(historyPlayerTwo).join("\n");

    gameScreen.playerOneHistory.setContent(updatedHistoryOne);
    gameScreen.playerTwoHistory.setContent(updatedHistoryTwo);

    gameScreen.PlayerOneRoundNotify.show();
    gameScreen.screen.render();

    await waitForKey(gameScreen.screen);

    gameScreen.PlayerOneRoundNotify.hide();
    gameScreen.screen.render();
    let diceRollPlayerOne = await rollDice(6, gameScreen, 1);
    await wait(1);
    let diceRollPlayerTwo;

    if (Player2 === "CPU") {
      gameScreen.PlayerTwoRoundNotify.show();
      gameScreen.screen.render();

      await wait(2);

      gameScreen.PlayerTwoRoundNotify.hide();
      gameScreen.screen.render();
      diceRollPlayerTwo = await rollDice(6, gameScreen, 2);
      await wait(1);
    } else {
      gameScreen.PlayerTwoRoundNotify.show();
      gameScreen.screen.render();

      await waitForKey(gameScreen.screen);

      gameScreen.PlayerTwoRoundNotify.hide();
      gameScreen.screen.render();
      diceRollPlayerTwo = await rollDice(6, gameScreen, 2);
      await wait(1);
    }

    const playerOneResult = getPlayerRoundResult(
      characters[playerOneCharacterIndex],
      circuit,
      diceRollPlayerOne,
    );
    const playerTwoResult = getPlayerRoundResult(
      characters[playerTwoCharacterIndex],
      circuit,
      diceRollPlayerTwo,
    );

    const {
      winner,
      playerOnePoints: newPlayerOnePoints,
      playerTwoPoints: newPlayerTwoPoints,
    } = getwinner(
      playerOneResult,
      playerTwoResult,
      playerOnePoints,
      playerTwoPoints,
      circuit,
    );
    await wait(1);

    playerOnePoints = newPlayerOnePoints;
    playerTwoPoints = newPlayerTwoPoints;

    if (winner === 1) {
      gameScreen.notification.setContent(`Jogador 1 venceu a rodada!`);
      gameScreen.notification.show();
      gameScreen.screen.render();
      await wait(2);
      gameScreen.notification.hide();
      gameScreen.screen.render();
    } else if (winner === 2) {
      gameScreen.notification.setContent(`Jogador 2 venceu a rodada!`);
      gameScreen.notification.show();
      gameScreen.screen.render();
      await wait(2);
      gameScreen.notification.hide();
      gameScreen.screen.render();
    } else {
      gameScreen.notification.setContent(`A rodada acabou em empate!`);
      gameScreen.notification.show();
      gameScreen.screen.render();
      await wait(2);
      gameScreen.notification.hide();
      gameScreen.screen.render();
    }

    const playerOneHistoryEntry = {
      round,
      circuit,
      diceRoll: diceRollPlayerOne,
      result: playerOneResult,
      winner: winner === 1 ? true : false,
    };

    const playerTwoHistoryEntry = {
      round,
      circuit,
      diceRoll: diceRollPlayerTwo,
      result: playerTwoResult,
      winner: winner === 2 ? true : false,
    };

    historyPlayerOne.push(playerOneHistoryEntry);
    historyPlayerTwo.push(playerTwoHistoryEntry);
  }

  gameScreen.screen.destroy();

  const finalScreen = createFinalScreen({
    playerOneCharacter: characters[playerOneCharacterIndex],
    playerTwoCharacter: characters[playerTwoCharacterIndex],
    playerOneScore: playerOnePoints,
    playerTwoScore: playerTwoPoints,
    playerOneHistory: historyPlayerOne,
    playerTwoHistory: historyPlayerTwo,
    winner:
      playerOnePoints > playerTwoPoints
        ? 1
        : playerTwoPoints > playerOnePoints
          ? 2
          : 0,
  });
}

main();
