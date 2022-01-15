import React from 'react';
import { Loading } from 'components/loading';
// @ts-ignore
import zh from './intl/zh-CN.json';
import en from './intl/en-US.json';

import 'scss/main.scss';

function App() {
  console.log(zh);
  console.log(en);
  return (
    <div>
      MetaSphere
      <Loading />
    </div>
  );
}

export { App };
