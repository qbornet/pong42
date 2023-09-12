export default function ToggleButton(props: {
  isLogin: boolean;
  toggleIsLogin: () => void;
}) {
  const { isLogin, toggleIsLogin } = props;
  return (
    <div
      style={{ boxShadow: 'inset 0 0 7px rgba(0,0,0,0.4)' }}
      className="relative h-[60px] w-full cursor-pointer rounded-[15px] bg-blue-pong-3 p-2"
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
