export function ProfilePicture() {
  return (
    <div className="z-[2]">
      <img
        className="my-10 h-16 w-16 rounded-full border-[4px] border-profile-purple md:h-24 md:w-24 lg:h-32 lg:w-32"
        //src={!imagePreview ? data?.img : imagePreview}
        alt="pp"
      />
    </div>
  );
}
