declare module 'react-world-flags' {
  import { CSSProperties, FC } from 'react';

  interface FlagProps {
    code: string;
    style?: CSSProperties;
    className?: string;
    title?: string;
    height?: number;
    width?: number;
    fallback?: React.ReactNode;
  }

  const Flag: FC<FlagProps>;
  export default Flag;
}
