import { useDatabase } from "./DatabaseContext";
import { useState } from "react";

function ProfileSettings({setScreen}) {
    const { deleteAllUserScores } = useDatabase();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="profile-settings">
            <h2>Profile Settings</h2>
            <button onClick={() => setIsModalOpen(true)} className="delete-score">Delete All Scores</button>
            {isModalOpen && (
                <div className="modal">
                    <h3>Are you sure you want to delete all your scores?</h3>
                    <button className="confirm-delete-all-scores" onClick={() => {
                        deleteAllUserScores();
                        setIsModalOpen(false);
                    }}>Yes</button>
                    <button onClick={() => setIsModalOpen(false)}>No</button>
                </div>
            )}
            <button onClick={() => setScreen("mainMenu")} className="back-to-main-menu-btn">Back to Main menu</button>
        </div>
    )
}

export default ProfileSettings;