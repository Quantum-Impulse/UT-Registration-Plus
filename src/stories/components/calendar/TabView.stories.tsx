import type { Meta, StoryObj } from '@storybook/react';
import TabView from 'src/views/components/calendar/TabView';

const meta = {
    title: 'Components/TabView/TabView',
    component: TabView,
    parameters: {
        layout: 'centered', 
    },
    tags: ['autodocs'], 
    argTypes: {
        activeTab: { 
            control: 'select', 
            options: ['Calendar', 'Chatbot'], 
            description: 'Currently active tab',
        },
    },
} satisfies Meta<typeof TabView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        activeTab: 'Calendar', // Default active tab
    },
};

export const ChatbotTab: Story = {
    args: {
        activeTab: 'Chatbot',
    },
};
