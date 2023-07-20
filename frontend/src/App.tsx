function App() {
  return (
    <div>
      <div className="relative mx-auto h-[63px] max-w-[133px] rounded-t-[2.5rem] bg-gray-800 dark:bg-gray-700" />
      <div className="relative mx-auto h-[213px] w-[208px] rounded-[2.5rem] border-[10px] border-gray-900 dark:border-gray-800 dark:bg-gray-800">
        <div className="absolute -right-[16px] top-[40px] h-[41px] w-[6px] rounded-r-lg bg-gray-800 dark:bg-gray-800" />
        <div className="absolute -right-[16px] top-[88px] h-[32px] w-[6px] rounded-r-lg bg-gray-800 dark:bg-gray-800" />
        <div className="h-[193px] w-[188px] overflow-hidden rounded-[2rem]">
          <img
            src="https://flowbite.s3.amazonaws.com/docs/device-mockups/watch-screen-image.png"
            className="w-[188px h-[193px] dark:hidden"
            alt=""
          />
          <img
            src="https://flowbite.s3.amazonaws.com/docs/device-mockups/watch-screen-image-dark.png"
            className="hidden h-[193px] w-[188px] dark:block"
            alt=""
          />
        </div>
      </div>
      <div className="relative mx-auto h-[63px] max-w-[133px] rounded-b-[2.5rem] bg-gray-800 dark:bg-gray-700" />
    </div>
  );
}

export default App;
