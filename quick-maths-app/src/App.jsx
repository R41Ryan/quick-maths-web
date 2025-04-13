import { useState } from "react";
import { AudioProvider } from "./AudioContext";
import { GameSettingProvider } from "./GameSettingContext";
import { DatabaseProvider } from "./DatabaseContext";
import Header from "./Header";
import MainMenu from "./MainMenu";
import GameInterface from "./GameInterface";
import SignUpInterface from "./SignUpInterface";
import SignInInterface from "./SignInInterface";

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
            {screen === "signUp" && (
              <SignUpInterface setScreen={setScreen} />
            )}
            {screen === "signIn" && (
              <SignInInterface setScreen={setScreen} />
            )}
          </AudioProvider>
        </GameSettingProvider>
      </DatabaseProvider>
    </>
  );
}

export default App;
