/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DashboardTabListing } from './tab_listing';
import { mount } from 'enzyme';

const dashboards = [
  {
    id: 'c39012d0-eb7a-11ed-8e00-17d7d50cd7b2',
    title: 'One',
  },
  {
    id: 'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
    title: 'Two',
  },
  {
    id: '722b74f0-b882-11e8-a6d9-e546fe2bba5f',
    title: 'Three',
  },
  {
    id: '7adfa750-4c81-11e8-b3d7-01146121b73d',
    title: 'Three',
  },
];

const renderListing = () => {
  return (
    <DashboardTabListing
      dashboards={dashboards}
      selectedDashboardId="c39012d0-eb7a-11ed-8e00-17d7d50cd7b2"
    />
  );
};

describe('DashboardTabListing', () => {
  it('should render', () => {
    const component = mount(renderListing());
    component.update();

    expect(component).toMatchSnapshot();
  });
});
