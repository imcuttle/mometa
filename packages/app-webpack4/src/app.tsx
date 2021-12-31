import React from 'react';
import { ConfigProvider, Button, Typography } from 'antd';
import { HashRouter } from 'react-router-dom';
import { Route } from 'react-router';
import zhCN from 'antd/lib/locale/zh_CN';
import './app.scss';
import pageDefaultLoading from '@/page-loading';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <React.Suspense fallback={pageDefaultLoading}>
        <HashRouter>
          <Route path={'*'}>
            <h1>Start</h1>
          </Route>
          {/*<ExtendRoutes route={route} />*/}
        </HashRouter>
      </React.Suspense>
    </ConfigProvider>
  );
}

export default App;
