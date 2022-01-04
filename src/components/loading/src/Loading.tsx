import React from 'react';
import { LoadingProps } from '../types';
import { DOMRef } from 'components/types/shared';
import { useDOMRef } from 'components/utils';

function Loading(props: LoadingProps, ref: DOMRef<HTMLDivElement>) {
  let { children } = props;

  let domRef = useDOMRef(ref);

  return (
    <div className="ms-loading" ref={domRef}>
      loading...
      {children}
    </div>
  );
}

let _Loading = React.forwardRef(Loading);
export { _Loading as Loading };
