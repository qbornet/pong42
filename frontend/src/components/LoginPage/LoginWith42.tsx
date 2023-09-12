import { CONST_AUTHORIZE_URL } from '@constant';
import IMAGES from '@img';

function generateRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  array.forEach((x) => (result += characters[x % charactersLength])); // eslint-disable-line
  return result;
}

export default function LoginWith42() {
  const handleClick = (e: any) => {
    e.preventDefault();
  };
  return (
    <div>
      <a href={`${CONST_AUTHORIZE_URL}&state=${generateRandomString(36)}`}>
        <button
          className="mt-2 flex h-[40px] w-full items-center justify-center rounded-[15px] border border-blue-pong-1 bg-green-login p-1 font-roboto text-[14px] font-bold text-white"
          type="button"
          onClick={handleClick}
        >
          <span className="pr-2"> Sign in With </span>
          <img src={IMAGES.logo_png} width="24" height="24" alt="42" />
        </button>
      </a>
    </div>
  );
}
