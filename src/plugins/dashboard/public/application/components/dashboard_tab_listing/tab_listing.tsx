/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiTab, EuiTabs } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useOpenSearchDashboards } from '../../../../../opensearch_dashboards_react/public';
import { DashboardServices } from '../../../types';

interface DashboardTabListingProps {
  dashboards: any[];
  selectedDashboardId: string;
}

export interface TabListingConfig {
  groups: Group[];
}

interface Group {
  dashboardId: string;
  detailDashboards: string[];
}

const config: TabListingConfig = {
  groups: [
    {
      dashboardId: 'c39012d0-eb7a-11ed-8e00-17d7d50cd7b2',
      detailDashboards: [
        'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
        '722b74f0-b882-11e8-a6d9-e546fe2bba5f',
      ],
    },
    {
      dashboardId: '7adfa750-4c81-11e8-b3d7-01146121b73d',
      detailDashboards: ['722b74f0-b882-11e8-a6d9-e546fe2bba5f'],
    },
  ],
};

export const DashboardTabListing = ({
  dashboards,
  selectedDashboardId,
}: DashboardTabListingProps) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [selectedDetailsDashboard, setSelectedDetailsDashboard] = useState<string | undefined>(
    undefined
  );

  const { services } = useOpenSearchDashboards<DashboardServices>();

  const isDashboardSelected = (dashboardId: string): boolean => {
    return selectedGroupId !== undefined && selectedGroupId === dashboardId;
  };

  const isDetailsDashboardSelected = (dashboardId: string): boolean => {
    return selectedDetailsDashboard !== undefined && selectedDetailsDashboard === dashboardId;
  };

  const selectDashboard = (dashboardId: string, isDetailsBoard: boolean = false) => {
    if (!isDetailsBoard) {
      setSelectedGroupId(dashboardId);
      setSelectedDetailsDashboard(undefined);
    } else {
      setSelectedDetailsDashboard(dashboardId);
    }
    services.application.navigateToUrl(`#/view/${dashboardId}`);
    const container = document.getElementById('dashboardViewport')?.firstChild;
    if (container) {
      // todo tlongo is this the right way to do this?
      ReactDOM.unmountComponentAtNode(document.getElementById('dashboardViewport') as Element);
    }
  };

  useEffect(() => {
    setSelectedGroupId(selectedDashboardId);
  }, [selectedDashboardId]);

  const renderDashboardTab = (dashboard: any, isDetailsBoard: boolean = false) => {
    return (
      <EuiTab
        isSelected={
          isDetailsBoard
            ? isDetailsDashboardSelected(dashboard!.id)
            : isDashboardSelected(dashboard!.id)
        }
        key={dashboard!.id}
        onClick={() => selectDashboard(dashboard!.id, isDetailsBoard)}
      >
        {dashboard!.title}
      </EuiTab>
    );
  };

  return (
    <>
      <EuiTabs>
        {dashboards &&
          config.groups.map((group) => {
            const dashboard = dashboards.find((d) => d.id === group.dashboardId);

            return renderDashboardTab(dashboard);
          })}
      </EuiTabs>
      <EuiTabs display="condensed" size="s">
        {dashboards &&
          selectedGroupId &&
          config.groups
            .filter((group) => group.dashboardId === selectedGroupId)
            .flatMap((group) => {
              return group.detailDashboards.map((dashboardId) => {
                const dashboard = dashboards.find((d) => d.id === dashboardId);

                return renderDashboardTab(dashboard, true);
              });
            })}
      </EuiTabs>
    </>
  );
};
