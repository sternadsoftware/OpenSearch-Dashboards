/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import './app.scss';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { DashboardConstants, createDashboardEditUrl } from '../dashboard_constants';
import { CreateButton, DashboardEditor, DashboardNoMatch } from './components';
import { DashboardTabListing } from './components/dashboard_tab_listing/tab_listing';
import { useOpenSearchDashboards } from '../../../opensearch_dashboards_react/public';
import { DashboardServices } from '../types';

export const DashboardApp = () => {
  const { services } = useOpenSearchDashboards<DashboardServices>();
  return (
    <>
      <EuiFlexGroup
        alignItems="center"
        justifyContent="spaceBetween"
        style={{ flexGrow: 0, paddingLeft: '8px', paddingRight: '8px' }}
      >
        <EuiFlexItem style={{ flexGrow: 0 }}>
          <DashboardTabListing showLandingPage={false} />
        </EuiFlexItem>
        <EuiFlexItem style={{ flexGrow: 0 }}>
          <CreateButton dashboardProviders={services.dashboardProviders()!} />
        </EuiFlexItem>
      </EuiFlexGroup>
      <Switch>
        {/*
            This construct is necessary to unmount the current editor instance when we switch to create-mode
            Otherwise the app won't create an empty dashboard to work on
          */}
        <Route path={[createDashboardEditUrl(':id')]}>
          <div className="app-container dshAppContainer">
            <DashboardEditor key={'editor-view-edit'} />
            <div id="dashboardViewport" />
          </div>
        </Route>
        <Route path={[DashboardConstants.CREATE_NEW_DASHBOARD_URL]}>
          <div className="app-container dshAppContainer">
            <DashboardEditor key={'editor-create-new'} />
            <div id="dashboardViewport" />
          </div>
        </Route>
        <Route path={['/', DashboardConstants.LANDING_PAGE_PATH]} />
        <DashboardNoMatch />
      </Switch>
    </>
  );
};
