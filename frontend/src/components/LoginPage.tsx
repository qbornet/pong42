import { useState } from 'react';

function Header() {
  return (
    <h1 className="text-center font-roboto text-[35px] font-bold text-white">
      Pong42
    </h1>
  );
}

function ToggleButton(props: { isLogin: boolean; toggleIsLogin: () => void }) {
  const { isLogin, toggleIsLogin } = props;
  return (
    <div
      style={{ boxShadow: 'inset 0 0 7px rgba(0,0,0,0.4)' }}
      className="relative h-[60px] w-full cursor-pointer rounded-[15px] bg-blue-pong-3 p-2"
      onClick={toggleIsLogin}
    >
      <div className="absolute inset-0 flex items-center justify-between">
        <span className="absolute left-10 top-3 h-[52px] w-[132px] p-2 font-roboto text-[14px] font-bold text-white">
          LOGIN
        </span>
        <span className="absolute left-40 top-3 h-[52px] w-[132px] p-2 font-roboto text-[14px] font-bold text-white">
          REGISTER
        </span>
      </div>
      <div
        className={`absolute left-1.5 top-1 h-[52px] w-[132px] rounded-[13px] border border-blue-pong-1 bg-blue-pong-4 p-2 font-roboto text-[14px] font-bold text-white transition-all duration-300 ease-in-out ${
          isLogin ? 'translate-x-0' : 'translate-x-[140px]'
        } `}
      >
        <div className="flex h-full items-center justify-center">
          {isLogin ? 'LOGIN' : 'REGISTER'}
        </div>
      </div>
    </div>
  );
}

function InputField(props: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { label, type, value, onChange } = props;
  return (
    <div>
      <label
        className="font-roboto text-[15px] font-bold text-blue-pong-1"
        htmlFor={label}
      >
        {label}
      </label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={onChange}
        className="h-[50px] w-full rounded-[15px] bg-blue-pong-3 p-2"
        style={{ boxShadow: 'inset 0 0 7px rgba(0,0,0,0.4)' }}
      />
    </div>
  );
}

function RegisterForm(props: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    handleSubmit
  } = props;

  const handleRegister42 = () => {
    console.log('Register with 42');
  };

  return (
    <form className="mt-1 text-white" onSubmit={handleSubmit}>
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value);
        }}
      />
      <InputField
        label="Username"
        type="text"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setUsername(e.target.value);
        }}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(e.target.value);
        }}
      />
      <div className="flex flex-col items-center justify-center">
        <button
          className="mt-7 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold"
          type="submit"
        >
          REGISTER TO ACCOUNT
        </button>
        <div className="my-2 flex items-center">
          <span className="font-roboto text-sm font-bold text-white">or</span>
        </div>
        <button
          className="mt-2 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-green-600 bg-green-login p-1 font-roboto text-[14px] font-bold"
          type="button"
          onClick={handleRegister42}
        >
          REGISTER WITH 42
        </button>
      </div>
    </form>
  );
}

function LoginForm(props: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { email, setEmail, password, setPassword, handleSubmit } = props;
  const handleLogin42 = () => {
    console.log('Login with 42');
  };

  return (
    <form className="mt-1 text-white" onSubmit={handleSubmit}>
      <InputField
        label="Email or Username"
        type="text"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value);
        }}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(e.target.value);
        }}
      />
      <div className="flex flex-col items-center justify-center">
        <button
          className="mt-7 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold"
          type="submit"
        >
          LOGIN TO ACCOUNT
        </button>
        <div className="my-2 flex items-center">
          <span className="font-roboto text-sm font-bold text-white">or</span>
        </div>
        <button
          className="mt-2 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-green-600 bg-green-login p-1 font-roboto text-[14px] font-bold"
          type="button"
          onClick={handleLogin42}
        >
          LOGIN WITH 42
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleIsLogin = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      `Email: ${email}, Username: ${username}, Password: ${password}`
    );
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <div className="flex w-80 w-[350px] flex-col rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-8 py-10">
        <Header />
        <ToggleButton isLogin={isLogin} toggleIsLogin={toggleIsLogin} />
        {isLogin ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
        ) : (
          <RegisterForm
            email={email}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

/*
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
*/
