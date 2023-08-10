import { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

interface ArrowTogglerProps {
  /**
   * Arrow is facing up or down
   */
  defaultUp?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Toggle components
 */
export default function ArrowToggler({
  defaultUp = false,
  onClick = undefined
}: ArrowTogglerProps) {
  const [toggle, setToggle] = useState(defaultUp);
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setToggle(!toggle);
  };
  return (
    <button type="button" onClick={handleClick} className="">
      {toggle ? <IoIosArrowDown /> : <IoIosArrowUp />}
    </button>
  );
}
