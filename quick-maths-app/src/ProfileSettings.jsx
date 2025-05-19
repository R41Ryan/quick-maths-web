import "./ProfileSettings.css"
import { useDatabase } from "./DatabaseContext";
import { useState } from "react";

function ProfileSettings({ setScreen }) {
    const { user, deleteAllUserScores, updateDisplayName } = useDatabase();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState("")
    const [message, setMessage] = useState("");

    function handleNewDisplayNameChange(e) {
        const value = e.target.value;
        setNewDisplayName(value);
    }

    async function handleChangeDisplayName() {
        try {
            await updateDisplayName(newDisplayName);
            setMessage(`Display name changed to ${newDisplayName}`);
        } catch (error) {
            if (error.message == 'duplicate key value violates unique constraint "profiles_display_name_key"') {
                setMessage(`Display name ${newDisplayName} already taken`);
            } else {
                setMessage(`Unknown Error: ${error.message}`);
            }
        }
    }

    return (
        <div className="profile-settings">
            <div className={isModalOpen ? "modal" : "modal hidden"}>
                <h3>Are you sure you want to delete all your scores?</h3>
                <button className="confirm-delete-all-scores" onClick={() => {
                    deleteAllUserScores();
                    setMessage("All scores deleted.")
                    setIsModalOpen(false);
                }}>Yes</button>
                <button onClick={() => setIsModalOpen(false)}>No</button>
            </div>

            <h2>Profile Settings</h2>
            <div className="profile-settings-options">
                <div className="display-name option">
                    <input type="text" placeholder="New Display Name" value={newDisplayName} onChange={handleNewDisplayNameChange} />
                    <button onClick={handleChangeDisplayName}>Change Display Name</button>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="delete-score">Delete All Scores</button>
                <p>{message}</p>
            </div>
            <button onClick={() => setScreen("mainMenu")} className="back-to-main-menu-btn">Back to Main menu</button>
        </div>
    )
}

export default ProfileSettings;