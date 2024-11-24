import React, { useEffect, useState } from 'react';

import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import type { Course } from '@shared/types/Course';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar';
import ChatbotHeader from '@views/components/calendar/ChatbotHeader';
import CalendarHeader from '@views/components/calendar/CalendarHeader';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules';
import ImportantLinks from '@views/components/calendar/ImportantLinks';
import Divider from '@views/components/common/Divider';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { CalendarContext } from '@views/contexts/CalendarContext';
import useCourseFromUrl from '@views/hooks/useCourseFromUrl';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import { MessageListener } from 'chrome-extension-toolkit';
import Text from '@views/components/common/Text/Text';

import CalendarFooter from './CalendarFooter';
import TeamLinks from './TeamLinks';

/**
 * Calendar page component
 */
export default function Chatbot(): JSX.Element {
    const { courseCells, activeSchedule } = useFlattenedCourseSchedule();

    const [course, setCourse] = useState<Course | null>(useCourseFromUrl());

    const [showPopup, setShowPopup] = useState<boolean>(course !== null);
    const [showSidebar, setShowSidebar] = useState<boolean>(true);

    return (
        <CalendarContext.Provider value>
            <div className='h-full w-full flex flex-col'>
                <ChatbotHeader
                    onSidebarToggle={() => {
                        setShowSidebar(!showSidebar);
                    }}
                />
                {/* <Text variant='h2' className='text-nowrap'>
                    Your 24/7 Advisor😎
                </Text> */}
                <div className='h-full flex overflow-auto pl-3'>
                    {showSidebar && (
                        <div className='h-full flex flex-none flex-col justify-between pb-5 screenshot:hidden'>
                            <div className='mb-3 h-full w-fit flex flex-col overflow-auto pb-2 pl-4.5 pr-4 pt-5'>
                                {/* <CalendarSchedules /> */}
                                {/* <Divider orientation='horizontal' size='100%' className='my-5' /> */}
                                <ImportantLinks />
                                <Divider orientation='horizontal' size='100%' className='my-5' />
                                <TeamLinks />
                            </div>
                            <CalendarFooter />
                        </div>
                    )}
                    <div className='h-full min-w-5xl flex flex-grow flex-col overflow-y-auto'>
                        <iframe
                            src="https://llama2.streamlit.app?embed=true"
                            className="chatbot-iframe w-full h-full border-none"
                            style={{height: '100%', width: '100%'}}
                        ></iframe>
                        {/* <div className='min-h-2xl flex-grow overflow-auto pl-2 pr-4 pt-6 screenshot:min-h-xl'>
                            <CalendarGrid courseCells={courseCells} setCourse={setCourse} />
                        </div> */}
                        {/* <CalendarBottomBar courseCells={courseCells} setCourse={setCourse} /> */}
                    </div>
                </div>

                <CourseCatalogInjectedPopup
                    // Ideally let's not use ! here, but it's fine since we know course is always defined when showPopup is true
                    // Let's try to refactor this
                    course={course!} // always defined when showPopup is true
                    onClose={() => setShowPopup(false)}
                    open={showPopup}
                    afterLeave={() => setCourse(null)}
                />
            </div>
        </CalendarContext.Provider>
    );
}
