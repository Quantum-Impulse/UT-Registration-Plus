import '@views/components/calendar/TabView.css';

import Calendar from '@views/components/calendar/Calendar';
import CalendarHeader from '@views/components/calendar/CalendarHeader';
// same w chatbot
// import Chatbot from '@views/components/chatbot/Chatbot';
import Chatbot from '@views/components/calendar/Chatbot';
import LangflowBot from '@views/components/calendar/LangflowBot';
import Lang from '@views/components/calendar/LangFlowComp';
import { Button } from '@views/components/common/Button';
import Text from '@views/components/common/Text/Text';
import React, { useState } from 'react';

import LangflowClient from './LangFlow';

const TabView = () => {
    // calendar is the default (first) tab
    const [activeTab, setActiveTab] = useState('calendar');

    return (
        <div className='tabview-container'>
            <div className='tabs flex items-center justify-center space-x-4'>
                {/* <Text variant='h2' className='text-nowrap'>
                    OPTIONS
                </Text> */}
                <Button
                    variant='single'
                    color='theme-red'
                    className='calendar-btn'
                    onClick={() => setActiveTab('calendar')}
                >
                    Calendar
                </Button>
                <Button
                    variant='single'
                    color='theme-red'
                    className='chatbot-btn'
                    onClick={() => setActiveTab('chatbot')}
                >
                    AI Advisor Assistant
                </Button>
            </div>

            {/* Tab Content */}
            <div className='tab-content'>
                {activeTab === 'calendar' && <Calendar />}
                {activeTab === 'chatbot' && <LangflowBot />}
            </div>
        </div>
    );
};

export default TabView;
