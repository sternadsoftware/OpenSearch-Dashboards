/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOpenSearchDashboards } from '../../../../../opensearch_dashboards_react/public';
import { DashboardServices } from '../../../types';
import { DashboardTabListing } from './tab_listing';
import { DashboardGroupsConfig } from '../../../plugin';

export const DashboardTabListingContainer = () => {
  const [dashboardList, setDashboardList] = useState<any[] | undefined>(undefined);
  const [groupConfig, setGroupConfig] = useState<DashboardGroupsConfig | undefined>(undefined);
  const { services } = useOpenSearchDashboards<DashboardServices>();
  const { id: dashboardIdFromUrl } = useParams<{ id: string }>();

  useEffect(() => {
    setGroupConfig(services.pluginInitializerContext.config.get<DashboardGroupsConfig>());
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

    const fetchDashboards = async () => {
      // todo tlongo optimization: query for ids in config
      const res = await services.savedObjectsClient.find({
        type: 'dashboard',
        search: undefined,
        fields: ['title'],
        perPage: 100,
        page: 1,
        searchFields: ['title^3'],
      });
      const list = res.savedObjects?.map(mapListAttributesToDashboardProvider) || [];

      return {
        total: list.length,
        hits: list,
      };
    };

    fetchDashboards().then((res) => setDashboardList(res.hits));
  }, [services]);

  return (
    <>
      {dashboardList && groupConfig && (
        <DashboardTabListing
          dashboards={dashboardList}
          loadedDashboardId={dashboardIdFromUrl}
          config={groupConfig}
        />
      )}
    </>
  );
};
