/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import './app.scss';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { EuiFlexItem } from '@elastic/eui';
import { DashboardConstants, createDashboardEditUrl } from '../dashboard_constants';
import { DashboardEditor, DashboardListing, DashboardNoMatch } from './components';
import { DashboardTabListingContainer } from './components/dashboard_tab_listing/dashboard_tab_listing_container';

export const DashboardApp = () => {
  return (
    <Switch>
      <Route path={[DashboardConstants.CREATE_NEW_DASHBOARD_URL, createDashboardEditUrl(':id')]}>
        <div className="app-container dshAppContainer">
          <EuiFlexItem style={{ flexGrow: 0 }}>
            <DashboardTabListingContainer />
          </EuiFlexItem>
          <DashboardEditor />
          <div id="dashboardViewport" />
        </div>
      </Route>
      <Route exact path={['/', DashboardConstants.LANDING_PAGE_PATH]}>
        <DashboardListing />
      </Route>
      <DashboardNoMatch />
    </Switch>
  );
};
