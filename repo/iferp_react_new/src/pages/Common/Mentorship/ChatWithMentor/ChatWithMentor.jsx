import Chat from 'pages/Common/NetworkManagement/Network/Chat';
import React from 'react';
import { useParams } from "react-router-dom";

const ChatWithMentor = () => {
    const param = useParams();
    const {userType, id, sId} = param;
    return (
        <div>
        <Chat mentorGroupID={id} sessionId={sId} userType={userType} />
        </div>
    )
}

export default ChatWithMentor
