export default function LoginWith42(/*props: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    }*/) {
    const handleLogin42 = () => {
        console.log('Login with 42');
    }
    return (
        <div>
            <button
                className="mt-2 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-green-login p-1 font-roboto text-white text-[14px] font-bold"
                type="button"
                onClick={handleLogin42}
            >
                LOGIN WITH 42
            </button>
        </div>
    );
}