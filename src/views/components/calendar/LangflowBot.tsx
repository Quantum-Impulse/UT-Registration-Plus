import React, { useEffect, useState } from 'react';
import ChatbotHeader from '@views/components/calendar/ChatbotHeader';
import { LangflowClient } from '@views/components/calendar/LangflowClient';
import Divider from '@views/components/common/Divider';

import CalendarFooter from './CalendarFooter';
import TeamLinks from './TeamLinks';
import ImportantLinks from '@views/components/calendar/ImportantLinks';

import '@views/components/calendar/LangflowBot.css';

export default function Chatbot(): JSX.Element {
    // State management
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [langflowClient, setLangflowClient] = useState<LangflowClient | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    // Initialize LangflowClient
    useEffect(() => {
        const flowIdOrName = 'd12d512b-6bd2-4193-81ef-0482d134b1e2';
        const langflowId = 'c4e8ea98-f0a9-4484-8dc3-1ee2411974b2';
        const applicationToken = 'AstraCS:DyHaWSMFOpQMUpHnQtXRWIjZ:4b9a0694663749a1fba22300a9fcb8adcb6b7772027208943b9b300ea3e6a3c3';

        if (flowIdOrName && langflowId && applicationToken) {
            const client = new LangflowClient('https://api.langflow.astra.datastax.com', applicationToken, flowIdOrName);
            client.flowIdOrName = flowIdOrName; // Ensure it's a valid string
            client.langflowId = langflowId; // Ensure it's a valid string
            setLangflowClient(client);
            console.log("LangflowClient initialized:", client);

        } else {
            console.error('Required parameters for LangflowClient are missing.');
        }
    }, []);

    const handleSendMessage = async () => {
        if (!langflowClient) {
            console.error('LangflowClient is not initialized');
            return;
        }

        const userMessage = inputValue.trim();
        if (userMessage === '') {
            return;
        }

        // Update the messages with the user's message
        setMessages([...messages, { sender: 'user', text: userMessage }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const inputType = 'chat';
            const outputType = 'chat';
            const stream = false;
            const tweaks = {
                "ChatInput-BvjFl": {},
                "ParseData-4Y2L2": {},
                "Prompt-DBtT3": {},
                "SplitText-xpNjv": {},
                "OpenAIModel-5tJZz": {},
                "ChatOutput-dsgze": {},
                "AstraDB-RE6GM": {},
                "OpenAIEmbeddings-I2Yan": {},
                "AstraDB-w3fJi": {},
                "OpenAIEmbeddings-xChef": {},
                "File-M3Krg": {},
            };

            const response = await langflowClient.runFlow(
                langflowClient.flowIdOrName as string, // Type assertion
                langflowClient.langflowId as string, // Type assertion
                userMessage,
                inputType,
                outputType,
                tweaks,
                stream,
                (data) => {
                    const botMessage = data.chunk;
                    setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botMessage }]);
                },
                (message) => {
                    console.log('Stream Closed:', message);
                    setIsLoading(false);
                },
                (error) => {
                    console.error('Stream Error:', error);
                    setIsLoading(false);
                }
            );

            if (!stream && response && response.outputs) {
                const flowOutputs = response.outputs[0];
                const firstComponentOutputs = flowOutputs.outputs[0];
                const output = firstComponentOutputs.outputs.message;

                const botMessage = output.message.text;
                setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botMessage }]);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error sending message:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className='h-full w-full flex flex-col'>
            <ChatbotHeader
                onSidebarToggle={() => setShowSidebar(!showSidebar)}
            />
            <div className='h-full flex overflow-auto pl-3'>
                {showSidebar && (
                    <div className='h-full flex flex-none flex-col justify-between pb-5 screenshot:hidden'>
                        <div className='mb-3 h-full w-fit flex flex-col overflow-auto pb-2 pl-4.5 pr-4 pt-5'>
                            <ImportantLinks />
                            <Divider orientation='horizontal' size='100%' className='my-5' />
                            <TeamLinks />
                        </div>
                        <CalendarFooter />
                    </div>
                )}
                <div className='h-full min-w-5xl flex flex-grow flex-col overflow-y-auto'>
                    <div className='chatbot-container flex flex-col flex-grow'>
                        <div className='messages flex-grow overflow-auto'>
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.sender}`}>
                                    <div className='message-text'>{message.text}</div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className='message bot'>
                                    <div className='message-text'>Typing...</div>
                                </div>
                            )}
                        </div>
                        <div className='input-container flex'>
                            <input
                                type='text'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                className='flex-grow'
                            />
                            <button className="chatbot-send-button" onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
