import { Block } from './Block';
import { Separator } from './Separator';
import { Title } from './Title';
import { Value } from './Value';

export function LeftBlock() {
  return (
    <div className="flex flex-row items-center justify-start gap-3">
      <Block>
        <Title>Total Game</Title>
        <Value>1243</Value>
      </Block>
      <Separator />
      <Block>
        <Title>Win</Title>
        <Value>65%</Value>
      </Block>
      <Separator />
      <Block>
        <Title>Loss</Title>
        <Value>35%</Value>
      </Block>
    </div>
  );
}
