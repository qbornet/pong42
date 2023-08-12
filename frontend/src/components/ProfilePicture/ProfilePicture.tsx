import profilePicture from '/starwatcher.jpg';

interface ProfilePictureProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  level?: number;
}

const style = Object.freeze({
  xs: 'h-14 w-14 border-[1.2px]',
  s: 'h-20 w-20 border-[1.7px]',
  m: 'h-28 w-28 border-[2.5px]',
  l: 'h-32 w-32 border-[3.5px]',
  xl: 'h-40 w-40 border-[5px]'
});

function ProfilePicture({ size = 'xl', level = 1 }: ProfilePictureProps) {
  return (
    <div
      className={`${style[size]} w-flex-shrink-0 rounded-full border-solid border-pong-purple bg-[url(/starwatcher.jpg)] bg-cover bg-no-repeat`}
    >
      <div>{level}</div>
    </div>
  );
}

export default ProfilePicture;
