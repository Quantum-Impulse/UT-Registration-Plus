import type TabInfoMessages from '@shared/messages/TabInfoMessages';
import Calendar from '@views/components/calendar/Calendar';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { MigrationDialog } from '@views/components/common/MigrationDialog';
import SentryProvider from '@views/contexts/SentryContext';
import { MessageListener } from 'chrome-extension-toolkit';
import useKC_DABR_WASM from 'kc-dabr-wasm';
import React, { useEffect } from 'react';

import TabView from '@views/components/calendar/TabView';

/**
 * Calendar page
 * @returns entire page
 */
export default function CalendarMain() {
    useKC_DABR_WASM();
    useEffect(() => {
        const tabInfoListener = new MessageListener<TabInfoMessages>({
            getTabInfo: ({ sendResponse }) => {
                sendResponse({
                    url: window.location.href,
                    title: document.title,
                });
            },
        });

        tabInfoListener.listen();

        return () => tabInfoListener.unlisten();
    }, []);

    return (
        <SentryProvider fullInit>
            <ExtensionRoot className='h-full w-full'>
                <DialogProvider>
                    <MigrationDialog />
                    <TabView />
                </DialogProvider>
            </ExtensionRoot>
        </SentryProvider>
    );
}
