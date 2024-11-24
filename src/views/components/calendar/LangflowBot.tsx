import '@views/components/calendar/LangflowBot.css';

import ChatbotHeader from '@views/components/calendar/ChatbotHeader';
import ImportantLinks from '@views/components/calendar/ImportantLinks';
import Divider from '@views/components/common/Divider';
import React, { useEffect, useState } from 'react';

import CalendarFooter from './CalendarFooter';
import TeamLinks from './TeamLinks';

export default function Chatbot(): JSX.Element {
    // State management
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    // Proxy URL (to Langflow API)
    const PROXY_URL = 'http://localhost:3000/proxy';

    const handleSendMessage = async () => {
        const userMessage = inputValue.trim();
        if (userMessage === '') return;

        // Update the messages with the user's message
        setMessages([...messages, { sender: 'user', text: userMessage }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint:
                        '/lf/c4e8ea98-f0a9-4484-8dc3-1ee2411974b2/api/v1/run/d12d512b-6bd2-4193-81ef-0482d134b1e2?stream=false',
                    body: {
                        input_value: userMessage,
                        input_type: 'chat',
                        output_type: 'chat',
                        tweaks: {
                            'ChatInput-BvjFl': {},
                            'ParseData-4Y2L2': {},
                            'Prompt-DBtT3': {},
                            'SplitText-xpNjv': {},
                            'OpenAIModel-5tJZz': {},
                            'ChatOutput-dsgze': {},
                            'AstraDB-RE6GM': {},
                            'OpenAIEmbeddings-I2Yan': {},
                            'AstraDB-w3fJi': {},
                            'OpenAIEmbeddings-xChef': {},
                            'File-M3Krg': {},
                        },
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const botMessage = data.outputs[0].outputs[0].results.message.text;

            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botMessage }]);
        } catch (error) {
            console.error('Error sending message:', error.message || error);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'bot', text: 'Error: Unable to process your request. Please try again.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='h-full w-full flex flex-col'>
            <ChatbotHeader onSidebarToggle={() => setShowSidebar(!showSidebar)} />
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
                    <div className='chatbot-container flex flex-grow flex-col'>
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
                                onChange={e => setInputValue(e.target.value)}
                                onKeyUp={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                className='flex-grow'
                            />
                            <button className='chatbot-send-button' onClick={handleSendMessage}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
