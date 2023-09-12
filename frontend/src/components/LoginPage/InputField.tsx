export default function InputField(props: {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) {
    const { label, type, value, onChange } = props;
    return (
      <div>
        <label
          className="font-roboto text-[15px] font-bold text-blue-pong-1"
          htmlFor={label}
        >
          {label}
        </label>
        <input
          type={type}
          id={label}
          value={value}
          onChange={onChange}
          className="h-[50px] w-full rounded-[15px] bg-blue-pong-3 p-2"
          style={{ boxShadow: 'inset 0 0 7px rgba(0,0,0,0.4)' }}
        />
      </div>
    );
  }