import { createContext, useContext } from "react";

const AudioContext = createContext();
const soundFilePath = "sounds/";

export const AudioProvider = ({ children }) => {
    const audioFiles = {
        inputDigit: new Audio(soundFilePath + "Retro1.mp3"),
        deleteDigit: new Audio(soundFilePath + "Retro2.mp3"),
        correct: new Audio(soundFilePath + "Retro10.mp3"),
        gameOver: new Audio(soundFilePath + "Wood Block2.mp3"),
        gameWin: new Audio(soundFilePath + "gameWin.wav"),
        achievementUnlock: new Audio(soundFilePath + "achievementUnlock.mp3"),
    };

    /**
     * 
     * @param {Audio} audio - The audio object to be played. 
     */
    const playSound = (audio) => {
        audio.currentTime = 0;
        audio.play();
    }

    return (
        <AudioContext.Provider value={{ audioFiles, playSound }}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    return useContext(AudioContext);
}