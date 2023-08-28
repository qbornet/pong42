import { FaTelegramPlane } from 'react-icons/fa';
import { useState } from 'react';
import socket from '../../services/socket';

function SendMessageInput() {
  const [message, setMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // setIsLoading(true);
    const data = {
      content: message,
      to: '1c632508-afb2-4fa7-a2b8-6030ab27e994'
    };
    socket.timeout(5000).emit('private message', data, () => {
      // setIsLoading(false);
    });
    setMessage('');
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-14 w-[336px] flex-shrink-0 items-center justify-between gap-y-24 bg-pong-blue-400 px-5"
    >
      <input
        type="text"
        id="UserEmail"
        placeholder="Send Message..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="peer h-8 w-full border-none bg-transparent pr-3 text-pong-white placeholder-pong-blue-100 outline-none"
      />
      <button type="submit">
        <FaTelegramPlane className="h-6 w-6 text-pong-blue-100" />
      </button>
    </form>
  );
}

export default SendMessageInput;
