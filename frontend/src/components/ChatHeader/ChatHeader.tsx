import ArrowToggler from '../ArrowToggler/ArrowToggler';
import Category from '../Category/Category';
import Status from '../Status/Status';

export default function ChatHeader() {
  return (
    <div className="flex w-80 flex-wrap content-center items-center justify-center gap-x-24 gap-y-1 rounded-3xl bg-blue-pong-400 p-5 shadow-pong shadow-blue-pong-100 backdrop-blur">
      <Category type="chat" />
      <ArrowToggler onClick={() => undefined} />
      <Status position="start" severity="ok" message="Connected" />
    </div>
  );
}
