export const ChatField = ()=>{
    
    return(
        <div className="message-container">
            <div className="message-user-container">
                <div className="user-message-avatar-container">
                    {/* <img className="user-message-avatar" src="https://media.discordapp.net/attachments/973983774046048266/986655465968635924/unknown.png" alt="" /> */}
                </div>
                <div className="user-message-info-container">
                    <div className="user-message-nickname">nickname expample</div>
                    <div className="user-message-text">123
                    </div>
                </div>
                {/* <div className="mesage-control-button">
            <div className="control-container">
                <div>delete</div>
                <div>redact</div>
                <div>timeout</div>
                <div>ban</div>
            </div>
            </div> */}
            </div>
        </div>
    )
}