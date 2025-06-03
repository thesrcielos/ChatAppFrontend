interface ChatHeaderProps {
  chatName: string;
  avatar: React.ReactNode;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({ chatName, avatar }) => {
  return (
    <header
      className="relative bg-blue-500 text-white p-4 shadow-md border-b border-blue-600"
      role="banner"
      aria-label={`Chat con ${chatName}`}
    >
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        {avatar}
      </div>
      
      <h1 className="text-center text-lg font-bold mx-auto">
        {chatName}
      </h1>
    </header>
  );
};

export default ChatHeader;