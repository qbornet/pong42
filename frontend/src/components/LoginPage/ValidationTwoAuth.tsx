import { useLoaderData } from 'react-router-dom';
import Header from './Header';

export default function ValidationTwoAuth() {
  const qrcode = useLoaderData() as string;

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <div className="flex w-[350px] flex-col items-center justify-center divide-y-[1px] divide-gray-400 rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-4 py-10">
        <Header name="Activate 2FA" />
        <div className="mt-2 flex flex-col items-center justify-center pt-2">
          <span className="break-keep font-roboto text-[12px] font-bold text-white">
            Scan the QR Code with Authenticator App
          </span>
          <img className="mt-1 pt-1" src={qrcode} alt="QRCODE" />
          <button // need to add Link from react-router to redirect to profile page or home page
            className="mt-3 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold text-white"
            type="button"
          >
            FINISH
          </button>
        </div>
      </div>
    </div>
  );
}
