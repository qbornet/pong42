import { useState } from 'react';
// import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const toggleSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = () => {
    console.log(`Email: ${ email }, Password: ${ password }`);
  };

  const handleLogin42 = () => {
    console.log("connexion avec 42")
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[url('./images/background.png')] bg-cover">
      <div className="w-[350px] bg-blue-pong-2 flex flex-col w-80 border border-blue-pong-1 rounded-[25px] px-8 py-10">
        <h1 className="font-roboto text-white text-[35px] text-center font-bold">Pong42</h1>
        
        <div className="flex justify-center space-x-4 mb-4">
          <div style={{ boxShadow: "inset 0 0 7px rgba(0,0,0,0.4)" }} className="relative w-full h-[60px] bg-blue-pong-3 p-2 rounded-[15px] cursor-pointer">
            <div 
             className={`font-roboto absolute top-1 left-1.5 w-[132px] h-[52px] text-[14px] text-white font-bold p-2 border border-blue-pong-1 rounded-[13px] bg-blue-pong-4 transition-all ease-in-out duration-300 ${isLogin ? 'translate-x-0' : 'translate-x-[140px]'}`}
             onClick={toggleSwitch}
            >
              <div className="flex items-center justify-center h-full">
                {isLogin ? 'LOGIN' : 'REGISTER'}
              </div>
            </div>
          </div>
        </div>

        <form className="text-white mt-1" onSubmit={handleSubmit}>
          <div>
            <label className="font-roboto text-[15px] text-blue-pong-1 font-bold" htmlFor="email">Email or Username</label>
            <input 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[50px] bg-blue-pong-3 w-full p-2 rounded-[15px]"
              style={{ boxShadow: "inset 0 0 7px rgba(0,0,0,0.4)" }}
            />
          </div>
          <div className="input-group">
            <label className="font-roboto text-[15px] text-blue-pong-1 font-bold" htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[50px] bg-blue-pong-3 w-full p-2 rounded-[15px]"
              style={{ boxShadow: "inset 0 0 7px rgba(0,0,0,0.4)" }}
            />
          </div>
          <button className="font-robotoe place-content-end font-bold text-[13px]">Forgot password?</button>
          <div className="flex flex-col items-center justify-center">
            <button className="font-roboto h-[40px] text-[14px] bg-blue-pong-4 border border-blue-pong-1 font-bold mt-7 bg-blue-pong-4 w-full p-1 rounded-[15px]" type="submit">
              LOGIN TO ACCOUNT
            </button>
              <div className="flex items-center my-2">
                <span className="font-roboto text-white font-bold text-sm">or</span>
              </div>
            <button className="font-roboto h-[40px] text-[14px] bg-green-login border border-blue-pong-1 font-bold mt-2 bg-green-600 w-full p-1 rounded-[15px]" type="button" onClick={handleLogin42}>
              LOGIN WITH 42
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
