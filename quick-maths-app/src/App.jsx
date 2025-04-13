import { useState } from "react";
import { AudioProvider } from "./AudioContext";
import { GameSettingProvider } from "./GameSettingContext";
import { DatabaseProvider } from "./DatabaseContext";
import Header from "./Header";
import MainMenu from "./MainMenu";
import GameInterface from "./GameInterface";

function App() {
  const [screen, setScreen] = useState("mainMenu");

  return (
    <>
      <DatabaseProvider>
        <GameSettingProvider>
          <AudioProvider>
            <Header />
            {screen === "mainMenu" && <MainMenu setScreen={setScreen} />}
            {screen === "gameInterface" && (
              <GameInterface setScreen={setScreen} />
            )}
          </AudioProvider>
        </GameSettingProvider>
      </DatabaseProvider>
    </>
  );
}

export default App;
