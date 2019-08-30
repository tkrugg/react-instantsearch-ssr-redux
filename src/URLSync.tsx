import React, { Component } from 'react';
import { AppProps } from './App';
import qs from 'qs';


const searchStateToURL = (searchState: any) => {
  if (!searchState) return '';
  const queryParams = {
    query: searchState.query,
    page: searchState.page,
    brands:
      searchState.refinementList.brand &&
      searchState.refinementList.brand.length
        ? searchState.refinementList.brand.join('-')
        : undefined,
  };
  return '/' + qs.stringify(queryParams, { addQueryPrefix: true });
};

const urlToSearchState = (search: string) => {
  const queryString = search.slice(1);
  const queryParams = qs.parse(queryString, {});
  return {
    query: queryParams.query,
    page: queryParams.page,
    refinementList: {
      brand: queryParams.brands ? queryParams.brands.split('-') : [],
    },
  };
};

const withURLSync = (App: React.ComponentType<AppProps>) =>
  class WithURLSync extends Component<
    Omit<AppProps, 'searchState' | 'createURL' | 'onSearchStateChange'>
  > {
    private debouncedSetState: any;

    public state: Readonly<{ searchState: any }>;

    private constructor(props: any) {
      super(props);
      this.state = {
        searchState: urlToSearchState(
          props.location.search
        ),
      };
    }

    public componentDidMount() {
      window.addEventListener('popstate', this.onPopState);
    }

    public componentWillUnmount() {
      clearTimeout(this.debouncedSetState);
      window.removeEventListener('popstate', this.onPopState);
    }

    private onPopState = ({ state }: { state: any }) =>
      this.setState({
        searchState: state || {},
      });

    public onSearchStateChange = (searchState: any) => {
      clearTimeout(this.debouncedSetState);

      const updateAfter = 700;
      this.debouncedSetState = setTimeout(() => {
        window.history.pushState(
          searchState,
          '',
          searchStateToURL(searchState)
        );
      }, updateAfter);

      this.setState({ searchState });
    };

    public render() {
      const { searchState } = this.state;

      return (
        <>
          <App
            {...this.props}
            searchState={searchState}
            onSearchStateChange={this.onSearchStateChange}
            createURL={searchStateToURL}
          />
        </>
      );
    }
  };

export default withURLSync;
