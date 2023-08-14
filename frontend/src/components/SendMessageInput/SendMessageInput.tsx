import { FaTelegramPlane } from 'react-icons/fa';
import { useState } from 'react';

function SendMessageInput() {
  const [message, setMessage] = useState('');
  return (
    <div className="flex h-14 w-[336px] flex-shrink-0 items-center justify-between gap-y-24 rounded-b-3xl bg-pong-blue-400 px-5">
      <label htmlFor="UserEmail" className="">
        <input
          type="text"
          id="UserEmail"
          placeholder="Send Message..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="peer h-8 w-full border-none bg-transparent p-0 text-pong-white placeholder-pong-blue-100 outline-none"
        />
      </label>
      <button type="button">
        <FaTelegramPlane className="text-2xl text-pong-blue-100" />
      </button>
    </div>
  );
}

export default SendMessageInput;
