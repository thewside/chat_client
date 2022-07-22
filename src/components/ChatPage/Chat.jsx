import './chat.scss';
import {UsersField} from './chatComponents/UsersField.jsx'
import {InputField} from './chatComponents/InputField/InputField.jsx'
import {ChatField} from './chatComponents/ChatField.jsx'
import {ChannelTabs} from './chatComponents/ChannelTabs.jsx'
export const Chat = () => {
    return (
        <div className='chat-page-container'>
            {/* <UsersField></UsersField> */}
            <div className='chat-container'>
                <ChannelTabs></ChannelTabs>
                <InputField></InputField>
                <ChatField></ChatField>
            </div>
        </div>
    )
}