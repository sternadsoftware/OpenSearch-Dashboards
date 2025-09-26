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
  loadedDashboardId: string;
}

export interface TabListingConfig {
  groups: Group[];
}

interface Group {
  mainDashboardId: string;
  detailDashboards: string[];
}

const config: TabListingConfig = {
  groups: [
    {
      mainDashboardId: 'c39012d0-eb7a-11ed-8e00-17d7d50cd7b2',
      detailDashboards: [
        'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
        '722b74f0-b882-11e8-a6d9-e546fe2bba5f',
      ],
    },
    {
      mainDashboardId: '7adfa750-4c81-11e8-b3d7-01146121b73d',
      detailDashboards: ['722b74f0-b882-11e8-a6d9-e546fe2bba5f'],
    },
  ],
};

const VIEWPORT_CONTAINER_ID = 'dashboardViewport';

export const DashboardTabListing = ({
  dashboards,
  loadedDashboardId,
}: DashboardTabListingProps) => {
  const [selectedMainDashboardId, setSelectedMainDashboardId] = useState<string | undefined>(
    undefined
  );
  const [selectedDetailsDashboard, setSelectedDetailsDashboard] = useState<string | undefined>(
    undefined
  );

  const { services } = useOpenSearchDashboards<DashboardServices>();

  const isMainDashboardSelected = (dashboardId: string): boolean => {
    return selectedMainDashboardId !== undefined && selectedMainDashboardId === dashboardId;
  };

  const isDetailsDashboardSelected = (dashboardId: string): boolean => {
    return selectedDetailsDashboard !== undefined && selectedDetailsDashboard === dashboardId;
  };

  const selectDashboard = (dashboardId: string, isDetailsBoard: boolean = false) => {
    if (!isDetailsBoard) {
      setSelectedMainDashboardId(dashboardId);
      setSelectedDetailsDashboard(undefined);
    } else {
      setSelectedDetailsDashboard(dashboardId);
    }
    services.application.navigateToUrl(`#/view/${dashboardId}`);
    unmountDashboardIfPresent();
  };

  const unmountDashboardIfPresent = () => {
    const container = document.getElementById(VIEWPORT_CONTAINER_ID)?.firstChild;
    if (container) {
      ReactDOM.unmountComponentAtNode(document.getElementById(VIEWPORT_CONTAINER_ID) as Element);
    }
  };

  useEffect(() => {
    const isDetailsBoard = (boardId: string) =>
      config.groups.flatMap((g) => g.detailDashboards).filter((d) => d === boardId).length > 0;

    if (!isDetailsBoard(loadedDashboardId)) {
      setSelectedMainDashboardId(loadedDashboardId);
    }
  }, [loadedDashboardId]);

  const renderDashboardTab = (dashboard: any, isDetailsBoard: boolean = false) => {
    return (
      <EuiTab
        isSelected={
          isDetailsBoard
            ? isDetailsDashboardSelected(dashboard!.id)
            : isMainDashboardSelected(dashboard!.id)
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
            const dashboard = dashboards.find((d) => d.id === group.mainDashboardId);

            return renderDashboardTab(dashboard);
          })}
      </EuiTabs>
      <EuiTabs display="condensed" size="s">
        {dashboards &&
          selectedMainDashboardId &&
          config.groups
            .filter((group) => group.mainDashboardId === selectedMainDashboardId)
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
