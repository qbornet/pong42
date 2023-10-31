import { Block } from './Block';
import { Title } from './Title';
import { Value } from './Value';

export function LeftBlock() {
  return (
    <div className="flex gap-3 ">
      <Block>
        <Title>Total Game</Title>
        <Value>1243</Value>
      </Block>
      <Block>
        <Title>Win</Title>
        <Value>65%</Value>
      </Block>
      <Block>
        <Title>Loss</Title>
        <Value>35%</Value>
      </Block>
    </div>
  );
}
