import { characters } from "../data/characters.js";

export async function chooseCharacters(P2IsCPU, rl) {
  console.log("[PLAYER 1]: Escolha um personagem para jogar:");
  console.table(
    characters.map((character, index) => ({
      Nome: character.name,
      Velocidade: character.speed,
      Manobrabilidade: character.handling,
      Poder: character.power,
    })),
  );

  let playerOneCharacterIndex
  do {
    const answer = await rl.question(
        "[PLAYER 1]: Digite o número do personagem escolhido (0-5): ",
      );

      if (answer.trim() === "") {
        console.log("Escolha um personagem.");
        continue;
      }

      const index = Number(answer);

      if (!Number.isInteger(index) || index < 0 || index >= characters.length) {
        console.log("Escolha um número entre 0 e 5.");
        continue;
      }

      playerOneCharacterIndex = index;
  } while (playerOneCharacterIndex === undefined)
    
  let cpuCharacterIndex;
  let playerTwoCharacterIndex;

  if (P2IsCPU) {
    do {
      cpuCharacterIndex = Math.floor(Math.random() * characters.length);
    } while (cpuCharacterIndex === playerOneCharacterIndex);
    console.clear();
  } else {
    console.clear();
    console.log("[PLAYER 1]: Escolha um personagem para jogar:");
    console.table(
      characters.map((character, index) => {
        if (index === playerOneCharacterIndex) {
          return {
            Nome: "Escolhido",
            Velocidade: "Escolhido",
            Manobrabilidade: "Escolhido",
            Poder: "Escolhido",
          };
        }
        return {
          Nome: character.name,
          Velocidade: character.speed,
          Manobrabilidade: character.handling,
          Poder: character.power,
        };
      }),
    );

    do {
      const answer = await rl.question(
        "[PLAYER 2]: Digite o número do personagem escolhido (0-5): ",
      );

      if (answer.trim() === "") {
        console.log("Escolha um personagem.");
        continue;
      }

      const index = Number(answer);

      if (!Number.isInteger(index) || index < 0 || index >= characters.length) {
        console.log("Escolha um número entre 0 e 5.");
        continue;
      }

      if (index === playerOneCharacterIndex) {
        console.log("Esse personagem já foi escolhido pelo PLAYER 1.");
        continue;
      }

      playerTwoCharacterIndex = index;
    } while (playerTwoCharacterIndex === undefined);
  }

  return {
    playerOneCharacterIndex,
    playerTwoCharacterIndex: P2IsCPU
      ? cpuCharacterIndex
      : playerTwoCharacterIndex,
  };
}
