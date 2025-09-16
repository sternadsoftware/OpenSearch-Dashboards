/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiTab, EuiTabs } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useOpenSearchDashboards } from '../../../../../opensearch_dashboards_react/public';
import { DashboardServices } from '../../../types';

export interface DashboardTabListingProps {
  showLandingPage: boolean;
}

export const DashboardTabListing = (props: DashboardTabListingProps) => {
  const [dashboardList, setDashboardList] = useState<{ total: number; hits: any[] } | undefined>(
    undefined
  );

  const [selectedTabId, setSelectedTabId] = useState<string | undefined>(undefined);

  const { services } = useOpenSearchDashboards<DashboardServices>();

  useEffect(() => {
    if (props.showLandingPage) {
      services.chrome.setBreadcrumbs([{ text: 'Dashboards' }]);
    }
    const mapListAttributesToDashboardProvider = (obj: any) => {
      const provider = (services.dashboardProviders() || {})[obj.type];
      return {
        id: obj.id,
        appId: provider.appId,
        type: provider.savedObjectsName,
        ...obj.attributes,
        updated_at: obj.updated_at,
        viewUrl: provider.viewUrlPathFn(obj),
        editUrl: provider.editUrlPathFn(obj),
      };
    };

    // todo tlongo do we need the 'search' param?
    const find = async (search: any) => {
      const res = await services.savedObjectsClient.find({
        type: 'dashboard',
        search: search ? `${search}*` : undefined,
        fields: ['title', 'type', 'description', 'updated_at'],
        perPage: 10000,
        page: 1,
        searchFields: ['title^3', 'type', 'description'],
        defaultSearchOperator: 'AND',
      });
      const list = res.savedObjects?.map(mapListAttributesToDashboardProvider) || [];

      return {
        total: list.length,
        hits: list,
      };
    };

    find('').then((res) => setDashboardList(res));
  }, [props.showLandingPage, services]);

  const isDashboardSelected = (dashboardId: string): boolean => {
    return selectedTabId !== undefined && selectedTabId === dashboardId;
  };

  const selectDashboard = (dashboardId: string) => {
    setSelectedTabId(dashboardId);
    services.application.navigateToUrl(`#/view/${dashboardId}`);
    const container = document.getElementById('dashboardViewport')?.firstChild;
    if (container) {
      // todo tlongo is this the right way to do this?
      ReactDOM.unmountComponentAtNode(document.getElementById('dashboardViewport') as Element);
    }
  };

  return (
    <EuiTabs>
      {dashboardList &&
        dashboardList.hits.map((dashboard) => (
          <EuiTab
            isSelected={isDashboardSelected(dashboard.id)}
            key={dashboard.id}
            onClick={() => selectDashboard(dashboard.id)}
          >
            {dashboard.title}
          </EuiTab>
        ))}
    </EuiTabs>
  );
};
