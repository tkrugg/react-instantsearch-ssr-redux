import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createInstantSearch } from 'react-instantsearch-dom/server';
import {
  Configure,
  SearchBox,
  RefinementList,
  Panel,
  Hits,
} from 'react-instantsearch-dom';

import withURLSync from './URLSync';
import Hit from './widgets/Hit';

export interface AppProps extends RouteComponentProps {
  resultsState: object;
  searchState: object;
  onSearchStateChange: Function;
  createURL: Function;
}

const { InstantSearch, findResultsState } = createInstantSearch();

export class AppComponent extends Component<AppProps> {
  public render(): React.ReactNode {
    return (
      <InstantSearch
        appId="latency"
        apiKey="6be0576ff61c053d5f9a3225e2a90f76"
        indexName="instant_search"
        resultsState={this.props.resultsState}
        searchState={this.props.searchState}
        onSearchStateChange={this.props.onSearchStateChange}
        createURL={this.props.createURL}
      >
        <header className="header">
          <SearchBox
            translations={{
              placeholder: 'Product, brand, color, …',
            }}
          />
        </header>

        <Configure
          attributesToSnippet={['description:10']}
          snippetEllipsisText="…"
          removeWordsIfNoResults="allOptional"
        />

        <main className="container">
          <div className="container-wrapper">
              <div className="container-body">
                <Panel header="Brands">
                  <RefinementList
                    attribute="brand"
                    searchable={true}
                    translations={{
                      placeholder: 'Search for brands…',
                    }}
                  />
                </Panel>
              </div>
          </div>

          <section className="container-results">
            <Hits hitComponent={Hit} />
          </section>
        </main>
      </InstantSearch>
    );
  }
}
export const App = withURLSync(AppComponent);
export { findResultsState };
