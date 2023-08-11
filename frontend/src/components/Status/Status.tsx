interface StatusProps {
  severity: 'ok' | 'warn' | 'err';
  message: string;
}

const colors = Object.freeze({
  ok: 'bg-green-500',
  warn: 'bg-yellow-500',
  err: 'bg-red-500'
});

/**
 * Status components
 */
export default function Status({
  severity = 'ok',
  message = 'Connecting'
}: StatusProps) {
  return (
    <div className="flex h-5 w-60 flex-shrink-0 items-center justify-center gap-5 bg-transparent">
      <div className={`h-4 w-4 rounded-full ${colors[severity]}`} />
      <p className="flex-center text-base font-bold text-white ">{message}</p>
    </div>
  );
}
