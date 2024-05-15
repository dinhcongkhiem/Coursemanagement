import Navbar from "../navbar/Navbar"
import './message.css'
import img from '../../assets/image/message.png'
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import LoadingOldMessage from "./LoadingOldMessage";
import MessageService from "../../service/MessageService";
export default function Message() {
    const [message, setMessage] = useState('');
    const chatContainerRef = useRef(null);
    const prevContainerRef = useRef(null);
    const [listLastestMessage, setListLastestMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { sendMessage, studentInfor, listStudentConnected, activeChatroom,
        setActiveChatroom, listMessageInAllChatroom, setListMessageInAllChatroom } = useSocket();
    useEffect(() => {
        if (listMessageInAllChatroom) {
            const updatedList = listMessageInAllChatroom.map(element => {
                return element.listChatMessage[element.listChatMessage.length - 1];
            });
            setListLastestMessage(updatedList);
        }
        if (chatContainerRef.current && prevContainerRef.current) {
            const element = chatContainerRef.current;
            chatContainerRef.current.style.scrollBehavior = 'auto';
            element.scrollTop = chatContainerRef.current.scrollHeight - prevContainerRef.current;
            prevContainerRef.current = null;
        }else{
            const element = chatContainerRef.current;
            element.scrollTop = chatContainerRef.current.scrollHeight;
            chatContainerRef.current.style.scrollBehavior = 'auto';

        }
    }, [listMessageInAllChatroom]);

    const handleScroll = (e) => {
        const { scrollTop } = e.target;

        if (scrollTop === 0 && listLastestMessage[activeChatroom]) {
            setIsLoading(true)
            prevContainerRef.current = chatContainerRef.current.scrollHeight;
            MessageService.GetOldMessage(listMessageInAllChatroom[activeChatroom]?.connectionId, listMessageInAllChatroom[activeChatroom]?.listChatMessage[0].createAt)
                .then((response) => {
                    if (response.data.length > 1) {
                        const updatedData = [...listMessageInAllChatroom];
                        updatedData[activeChatroom].listChatMessage = [...response.data, ...updatedData[activeChatroom].listChatMessage];
                        setListMessageInAllChatroom(updatedData)
                    }else{
                        prevContainerRef.current = null;
                    }
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false)

                });
        }
    }


    const handleSendMessage = (e) => {
        e.preventDefault();
        chatContainerRef.current.style.scrollBehavior = "smooth"
        if (listLastestMessage.length !== 0 && message.trim().length !== 0) {
            sendMessage(message)
            setMessage("");
        }
    }
    const handleChangeChatroom = (index) => {
        localStorage.setItem('activeChatroom', index);
        setActiveChatroom(index)
    }

    const calculateTimeString = (sendTime) => {
        const currentTime = new Date();
        const specificTime = new Date(sendTime);
        const timeDiff = currentTime.getTime() - specificTime.getTime();
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
        const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));

        if (minutes < 60) {
            return `${minutes}m`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else if (days < 7) {
            return `${days}d`;
        } else if (weeks < 52) {
            return `${weeks}w`;
        } else {
            return `${years}y`;
        }
    };


    return (
        <div className="d-flex message-container">
            <Navbar />

            <div className="list-contact">
                <h3>Chats</h3>
                {(listStudentConnected.length) ? (listStudentConnected?.map((student, index) => (
                    <div className={`chat-room ${activeChatroom === index ? 'active' : ''}`} onClick={() => handleChangeChatroom(index)} key={index}>
                        <div className="img-contact">
                            <img src={student.avatar} alt="avatar" />
                        </div>
                        <div className="infor-contact">
                            <div className="contact-name">
                                <p>{student.name}</p>
                            </div>
                            <div className="prev-message">
                                {listLastestMessage[index]?.content ?  <p>
                                    <span>{listLastestMessage[index]?.senderId === studentInfor.id ? 'You' : student.name}: </span>
                                    <span>{listLastestMessage[index]?.content}</span> - <span>{calculateTimeString(listLastestMessage[index]?.createAt)}</span>
                                </p> : <p>Send message</p>}
                               
                            </div>
                        </div>
                    </div>
                ))) : (<div className='chat-room active'>
                    <div className="infor-contact">
                        <div className="contact-name">
                            <p>No one has matched with you yet</p>
                        </div>
                    </div>
                </div>)}


            </div>
            <div className="chat-container">
                <div className="header-chat"></div>
                <div className="content-block">

                </div>
                <div className="content-chat" ref={chatContainerRef} onScroll={handleScroll}>
                    {listMessageInAllChatroom[activeChatroom]?.listChatMessage.map((message, index) => (
                        <div className={`message-block ${message.senderId === studentInfor.id ? 'flex-row-reverse' : ''}`} key={index}>
                            <div className="avt-texter">
                                <img src={message.senderId === studentInfor.id ? studentInfor.avatar : listStudentConnected[activeChatroom]?.avatar} alt="" />
                            </div>
                            <div className="message">
                                <p>{message.content}</p>

                            </div>
                        </div>
                    ))}
                    <LoadingOldMessage isLoading={isLoading} />

                </div>

                <div className="input-chat">
                    <form action="">
                        <input type="text" name="" id="" value={message} onChange={(e) => { setMessage(e.target.value) }} />
                        <div>
                            <button onClick={(e) => handleSendMessage(e)}><img src={img} alt="" /></button>
                        </div>
                    </form>

                </div>

            </div>
        </div>
    )
}