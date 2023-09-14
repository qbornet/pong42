import Header from './Header';
import LoginWith42 from './LoginWith42';

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <div className="flex w-[350px] flex-col rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-8 py-10">
        <Header />
        <LoginWith42 />
      </div>
    </div>
  );
}
