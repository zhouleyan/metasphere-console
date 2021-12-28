import React, { ReactElement } from 'react';
import { LoadingProps } from '../../types';

function Loading(props: LoadingProps) {
  const { children } = props;

  return (
    <div>
      loading...
      {children}
    </div>
  );
}

let _Loading = React.forwardRef(Loading) as (props: LoadingProps) => ReactElement;
export { _Loading as Loading };
