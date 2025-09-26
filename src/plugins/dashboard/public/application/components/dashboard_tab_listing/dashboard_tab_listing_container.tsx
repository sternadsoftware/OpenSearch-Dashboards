/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOpenSearchDashboards } from '../../../../../opensearch_dashboards_react/public';
import { DashboardServices } from '../../../types';
import { DashboardTabListing } from './tab_listing';

export const DashboardTabListingContainer = () => {
  const [dashboardList, setDashboardList] = useState<any[] | undefined>(undefined);
  const { services } = useOpenSearchDashboards<DashboardServices>();
  const { id: dashboardIdFromUrl } = useParams<{ id: string }>();

  useEffect(() => {
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
      // todo tlongo query for ids in config
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

    find('').then((res) => setDashboardList(res.hits));
  }, [services]);

  return (
    <>
      {dashboardList && (
        <DashboardTabListing dashboards={dashboardList} selectedDashboardId={dashboardIdFromUrl} />
      )}
    </>
  );
};
