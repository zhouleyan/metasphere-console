import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Loading } from 'components/loading';
import { LocaleProvider } from 'components/locale-provider';
import { App } from '../core/App';

// handle safari browser zoom out too small
window.onresize = () => {
  const ratio = window.outerHeight / window.innerHeight;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') && ratio < 0.75) {
    // @ts-ignore
    document.body.style.zoom = 1.5;
  } else {
    // @ts-ignore
    document.body.style.zoom = 1;
  }
};

const render = (component: JSX.Element) => {
  ReactDOM.render(
    <Suspense fallback={<Loading />}>
      <LocaleProvider locale="zh-CN">{component}</LocaleProvider>
    </Suspense>,
    document.getElementById('root')
  );
};

render(<App />);

// @ts-ignore
module.hot &&
  // @ts-ignore
  module.hot.accept('../core/App', () => {
    const NextApp = require('../core/App');
    render(<NextApp />);
  });
