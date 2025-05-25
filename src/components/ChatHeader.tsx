interface ChatHeaderProps {
  chatName: string;
}

const ChatHeader = ({ chatName }: ChatHeaderProps) => {
  return (
    <header className="p-4 bg-blue-500 text-white font-bold text-lg">
      {chatName}
    </header>
  );
};

export default ChatHeader;
