function ProfileSettings({setScreen}) {
    return (
        <div className="profile-settings">
            <h2>Profile Settings</h2>
            <button onClick={() => setScreen("mainMenu")} className="back-to-main-menu-btn">Back to Main menu</button>
        </div>
    )
}

export default ProfileSettings;