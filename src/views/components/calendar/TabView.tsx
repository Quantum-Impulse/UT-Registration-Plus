import React, { useState } from 'react';
import Calendar from '@views/components/calendar/Calendar';
import CalendarHeader from '@views/components/calendar/CalendarHeader';

// same w chatbot
// import Chatbot from '@views/components/chatbot/Chatbot';
import Chatbot from '@views/components/calendar/Chatbot';
import LangflowBot from '@views/components/calendar/LangflowBot'
import LangflowClient from './LangFlow';

import { Button } from '@views/components/common/Button';
import '@views/components/calendar/TabView.css';
import Text from '@views/components/common/Text/Text';

const TabView = () => {
    // calendar is the default (first) tab
    const [activeTab, setActiveTab] = useState('calendar'); 

    return (
        <div className='tabview-container'>
            <div className='tabs flex space-x-4 justify-center items-center'>
                {/* <Text variant='h2' className='text-nowrap'>
                    OPTIONS
                </Text> */}
                <Button variant='single' color='theme-red' className='calendar-btn' onClick={() => setActiveTab('calendar')}>
                    Calendar
                </Button>
                <Button variant='single' color='theme-red' className='chatbot-btn' onClick={() => setActiveTab('chatbot')}>
                    AI Advisor Assistant
                </Button>
            </div>

            {/* Tab Content */}
            <div className='tab-content'>
                {activeTab === 'calendar' && <Calendar />}
                {activeTab === 'chatbot' && <LangflowClient />}
                {/* {activeTab === 'chatbot' && (
                    <iframe
                        src="https://llama2.streamlit.app?embed=true"
                        className="chatbot-iframe w-full h-full border-none"
                        style={{height: '100%', width: '100%'}}
                    ></iframe>
                )} */}
            </div>

        </div>
    );
};

export default TabView;
