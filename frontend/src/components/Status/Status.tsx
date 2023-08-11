interface StatusProps {
  position: 'start' | 'center' | 'end';
  severity: 'ok' | 'warn' | 'err';
  message: string;
}

const colors = Object.freeze({
  ok: 'bg-green-300',
  warn: 'bg-yellow-500',
  err: 'bg-red-500'
});

/**
 * Status components
 */
export default function Status({
  position = 'center',
  severity = 'ok',
  message = 'Connecting'
}: StatusProps) {
  return (
    <div
      className={`flex h-5 w-full flex-shrink-0 items-center justify-${position} gap-5 bg-transparent`}
    >
      <div className={`h-4 w-4 rounded-full ${colors[severity]}`} />
      <p className="flex pt-1 text-base font-bold text-white ">{message}</p>
    </div>
  );
}
