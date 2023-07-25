import { useRef } from 'react';
import socket from './socket';

function App() {
  const username = useRef('');
  const handleClick = () => {
    socket.auth = { username };
    socket.connect();
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <label
        htmlFor="Username"
        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type="text"
          id="Username"
          className="peer border-none bg-transparent p-3 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
          placeholder="Username"
          onChange={(data) => {
            username.current = data.target.value;
          }}
        />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          Username
        </span>
      </label>
      <button
        className="inline-block rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500"
        type="submit"
        onClick={handleClick}
      >
        Send
      </button>
    </div>
  );
}

export default App;
