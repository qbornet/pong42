export default function InputField(props: {
  label: string;
  type: string;
  name?: string;
}) {
  const { label, type, name } = props;
  return (
    <div className="p-[1px]">
      <label
        className="font-roboto text-[15px] font-bold text-blue-pong-1"
        htmlFor={label}
      >
        {label}
      </label>
      <input
        type={type}
        name={name !== undefined ? name : type}
        id={label}
        className="h-[50px] w-full rounded-[15px] bg-blue-pong-3 p-2 text-white"
        style={{ boxShadow: 'inset 0 0 7px rgba(0,0,0,0.4)' }}
      />
    </div>
  );
}
