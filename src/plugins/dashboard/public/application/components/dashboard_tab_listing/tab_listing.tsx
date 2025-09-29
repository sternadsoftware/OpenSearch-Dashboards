/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiTab, EuiTabs } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useOpenSearchDashboards } from '../../../../../opensearch_dashboards_react/public';
import { DashboardServices } from '../../../types';
import { DashboardGroupsConfig } from '../../../plugin';

interface DashboardTabListingProps {
  dashboards: any[];
  loadedDashboardId: string;
  config: DashboardGroupsConfig;
}

export interface TabListingConfig {
  groups: Group[];
}

interface Group {
  mainDashboardId: string;
  detailDashboards: string[];
}

const VIEWPORT_CONTAINER_ID = 'dashboardViewport';

export const DashboardTabListing = ({
  dashboards,
  loadedDashboardId,
  config,
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
      config.groups.flatMap((g) => g.detailsDashboards).filter((d) => d === boardId).length > 0;

    if (!isDetailsBoard(loadedDashboardId)) {
      setSelectedMainDashboardId(loadedDashboardId);
    }
  }, [config, config.groups, loadedDashboardId]);

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
              return group.detailsDashboards.map((dashboardId) => {
                const dashboard = dashboards.find((d) => d.id === dashboardId);

                return renderDashboardTab(dashboard, true);
              });
            })}
      </EuiTabs>
    </>
  );
};
