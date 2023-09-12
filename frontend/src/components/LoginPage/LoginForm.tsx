import InputField from './InputField';

export default function LoginForm(props: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { email, setEmail, password, setPassword, handleSubmit } = props;

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
          className="mt-7 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold"
          type="submit"
        >
          LOGIN TO ACCOUNT
        </button>
      </div>
    </form>
  );
}
