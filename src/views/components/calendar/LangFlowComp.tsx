declare global {
    namespace JSX {
        interface IntrinsicElements {
            'langflow-chat': any;
        }
    }
}
export default function ChatWidget({ className }) {
    return (
        <div className={className}>
            {' '}
            <langflow-chat
                chat_inputs='{"your_key":"value"}'
                chat_input_field='your_chat_key'
                flow_id='your_flow_id'
                host_url='langflow_url'
            />{' '}
        </div>
    );
}
