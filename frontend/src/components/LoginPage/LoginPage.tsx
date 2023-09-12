import { useState } from 'react';
import Header from './Header';
import LoginForm from './LoginForm';
import LoginWith42 from './LoginWith42';

export default function LoginPage() {
  // const [isLogin, setIsLogin] = useState(true);
  // const [email, setEmail] = useState('');
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(
  //     `Email: ${email}, Username: ${username}, Password: ${password}`
  //     );
  //   };
    
    const [showLoginWith42, setShowLoginWith42] = useState(true);

    const toggleForm = () => {
      setShowLoginWith42(!showLoginWith42);
    };

    return (
      <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <div className="flex w-80 w-[350px] flex-col rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-8 py-10">
        <Header />
        {showLoginWith42 ? <LoginWith42 /> : <LoginForm />}
        <button onClick={toggleForm} className="text-white">
          {showLoginWith42 ? 'Switch to LoginForm' : 'Switch to LoginWith42'}
        </button>
      </div>
    </div>
  );
}

