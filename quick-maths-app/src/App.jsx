import { useState } from "react";
import { AudioProvider } from "./AudioContext";
import { GameSettingProvider } from "./GameSettingContext";
import Header from "./Header";
import MainMenu from "./MainMenu";
import GameInterface from "./GameInterface";

function App() {
  const [screen, setScreen] = useState("mainMenu");

  return (
    <>
      <GameSettingProvider>
        <AudioProvider>
          <Header />
          {screen === "mainMenu" && <MainMenu setScreen={setScreen}/>}
          {screen === "gameInterface" && <GameInterface setScreen={setScreen}/>}
        </AudioProvider>
      </GameSettingProvider>
    </>
  );
}

export default App;
