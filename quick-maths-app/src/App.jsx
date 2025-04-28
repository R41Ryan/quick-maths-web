import { useState } from "react";
import { AudioProvider } from "./AudioContext";
import { GameSettingProvider } from "./GameSettingContext";
import { DatabaseProvider } from "./DatabaseContext";
import Header from "./Header";
import MainMenu from "./MainMenu";
import GameInterface from "./GameInterface";
import SignUpInterface from "./SignUpInterface";
import SignInInterface from "./SignInInterface";
import PersonalScoreDisplay from "./personalScoreDisplay";
import PersonalProgressChart from "./PersonalProgressChart";
import GlobalScoreDisplay from "./GlobalScoreDisplay";

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
            {screen === "signUp" && <SignUpInterface setScreen={setScreen} />}
            {screen === "signIn" && <SignInInterface setScreen={setScreen} />}
            {screen === "personalScoreDisplay" && (
              <PersonalScoreDisplay setScreen={setScreen} />
            )}
            {screen === "personalProgressChart" && (
              <PersonalProgressChart setScreen={setScreen} />
            )}
            {screen === "globalScoreDisplay" && (
              <GlobalScoreDisplay setScreen={setScreen} />
            )}
          </AudioProvider>
        </GameSettingProvider>
      </DatabaseProvider>
    </>
  );
}

export default App;
