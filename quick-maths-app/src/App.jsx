import { useEffect, useState } from "react";
import { AudioProvider } from "./AudioContext";
import { GameSettingProvider } from "./GameSettingContext";
import { DatabaseProvider } from "./DatabaseContext";
import { AchievementTrackerProvider } from "./AchievementTrackerContext";
import Header from "./Header";
import MainMenu from "./MainMenu";
import GameInterface from "./GameInterface";
import SignUpInterface from "./SignUpInterface";
import SignInInterface from "./SignInInterface";
import PersonalScoreDisplay from "./PersonalScoreDisplay";
import PersonalProgressChart from "./PersonalProgressChart";
import GlobalScoreDisplay from "./GlobalScoreDisplay";
import UserAchievements from "./UserAchievements";
import ProfileSettings from "./ProfileSettings";
import CustomGame from "./CustomGame";
import PasswordReset from "./PasswordReset";
import ForgotPassword from "./ForgotPassword";
import supabase from "./supabaseClient";

function App() {
  const [screen, setScreen] = useState("mainMenu");

  useEffect(() => {
    const checkReset = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_tokens");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (type === "recovery") {
        setScreen("passwordReset");
      }
    }

    checkReset();
  }, [])

  return (
    <>
      <DatabaseProvider>
        <AchievementTrackerProvider>
          <AudioProvider>
            <GameSettingProvider>
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
                {screen === "userAchievements" && (
                  <UserAchievements setScreen={setScreen} />
                )}
                {screen === "profileSettings" && (
                  <ProfileSettings setScreen={setScreen} />
                )}
                {screen === "customGame" && (
                  <CustomGame setScreen={setScreen} />
                )}
                {screen === "passwordReset" && (
                  <PasswordReset setScreen={setScreen} />
                )}
                {screen === "forgotPassword" && (
                  <ForgotPassword setScreen={setScreen} />
                )}
            </GameSettingProvider>
          </AudioProvider>
        </AchievementTrackerProvider>
      </DatabaseProvider>
    </>
  );
}

export default App;
