import React, { createContext, useContext, useEffect, useState } from 'react';
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import StudentService from '../service/StudentService';
import ConnectionService from '../service/ConnectionService';
import MessageService from '../service/MessageService';
import { WEBSOCKET_URL } from '../constants';
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [listStudentConnected, setListStudentConnected] = useState([]);
    const [studentInfor, setStudentInfor] = useState({});
    const [activeChatroom, setActiveChatroom] = useState(0);
    const [listMessageInAllChatroom, setListMessageInAllChatroom] = useState([])

    useEffect(() => {
        const storedIndex = localStorage.getItem('activeChatroom');
        const accessToken = localStorage.getItem('accessToken');
        if (storedIndex) {
            setActiveChatroom(parseInt(storedIndex));
        }
        if (accessToken) {
            MessageService.GetMessageInAllChatRoom()
                .then((response) => {
                    setListMessageInAllChatroom(response.data);
                }).catch((err) => {
                    console.error(err);
                });
            getListStudentConnect()
            StudentService.getInforStudent()
                .then((response) => {
                    setStudentInfor(response.data);
                    connect(response.data.id);

                }).catch((err) => {
                    console.error(err);
                });

        }

    }, []);

    const getListStudentConnect = () => {
        ConnectionService.getListStudentInConnection()
            .then((response) => {
                setListStudentConnected(response.data);
            }).catch((err) => {
                console.error(err);
            });
    }
    const connect = async (StudentId) => {
        const sockJSFactory = () => new SockJS(WEBSOCKET_URL);
        const client = Stomp.over(sockJSFactory);
        client.debug = () => {};
        client.connect({}, () => onConnected(client, StudentId), onError);
        setStompClient(client);


    };

    const onConnected = async (client, StudentId) => {
        client.subscribe(`/user/${StudentId}/queue/messages`, onMessageReceived);
        client.subscribe(`/user/public`, onMessageReceived);
        client.send("/app/chat.addUser",
            {},
            JSON.stringify({ sender: "hello", type: 'JOIN' })
        );

    };

    const onMessageReceived = async (payload) => {
        const ReceivedMessage = JSON.parse(payload.body)
        setListMessageInAllChatroom(prev => {
            return prev.map(element => {
                if (element.connectionId === ReceivedMessage.connectionId) {
                    return {
                        ...element,
                        listChatMessage: [...element.listChatMessage, ReceivedMessage]
                    };
                }
                return element;
            });
        });
    }

    const onError = (err) => {
        console.error('Socket connection error:', err);
    };
    const sendMessage = (message) => {

        const chatMessage = {
            connectionId: listStudentConnected[activeChatroom].connectionId,
            senderId: studentInfor.id,
            recipientId: listStudentConnected[activeChatroom].studentId,
            content: message,
            createAt: new Date()
        };
        setListMessageInAllChatroom(prev => {
            const newList = [...prev];
            newList[activeChatroom].listChatMessage = [...newList[activeChatroom].listChatMessage, chatMessage];
            return newList;
        });
        if (stompClient) {
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        } else {
            console.error('Stomp client is not initialized.');
        }
    };
    return (
        <SocketContext.Provider
            value={{
                sendMessage, listStudentConnected,
                studentInfor, setActiveChatroom, activeChatroom,
                listMessageInAllChatroom, getListStudentConnect, setListMessageInAllChatroom
            }}>
            {children}
        </SocketContext.Provider>
    );
};
