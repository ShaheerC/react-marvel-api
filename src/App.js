import React, { Component } from 'react';
import './App.css';
import { ResultsList } from './components/ResultsList';
import { ResultDetails } from './components/ResultDetails';
import { SearchBar } from './components/SearchBar';
import { Error } from './components/Error';
import { Loading } from './components/Loading';
import { MarvelService } from './services/MarvelService';
import { LoadMore } from './components/LoadMore';

class App extends Component {
  // --------------------------------------------------
  // SETUP
  // --------------------------------------------------
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchType: 'Characters',
      results: [],
      selectedResult: null,
    };

    this.fetchCharacters = this.fetchCharacters.bind(this);
    this.fetchCharacter = this.fetchCharacter.bind(this);
    this.fetchMoreCharacters = this.fetchMoreCharacters.bind(this);
    this.fetchMoreComics = this.fetchMoreComics.bind(this);
    this.fetchComic = this.fetchComic.bind(this);

    this.marvelService = new MarvelService({
      apiKey: this.props.apiKey,
    });
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  render() {
    let loadMoreElem = '';
    if (this.state.canLoadMore) {
      loadMoreElem = 
      <LoadMore 
        onClick={ 
          this.state.searchType === 'Characters'
          ? this.fetchMoreCharacters
          : this.fetchMoreComics 
        } 
      />
    }

    const resultsElem = this.state.hasError
      ? <Error />
      : this.state.isLoading
        ? <Loading searchTerm={ this.state.searchTerm } />
        : (
          <ResultsList
            results={ this.state.results }
            searchTerm={ this.state.searchTerm }
            searchType={ this.props.searchType }
            onResultClick={ this.state.searchType === 'Characters' ? this.fetchCharacter : this.fetchComic }
          />
        );

    const detailsElem = this.state.selectedResult
      ? (
        <ResultDetails
          image={ this.state.selectedResult.thumbnail.path +  '.' + this.state.selectedResult.thumbnail.extension }
          title={ this.state.selectedResult.name }
          description={ this.state.selectedResult.description }
          stories={ this.state.selectedResult.stories }
          urls={ this.state.selectedResult.urls }
          onClose={ () => this.setState({ selectedResult: null } )}
        />
      )
      : '';

    return (
      <section className="app">
        <SearchBar
          searchType={ this.state.searchType }
          searchTerm={ this.state.searchTerm }
          onSelect={ (searchType) => this.setState({ searchType }) }
          onSubmit={ (searchTerm) => this.setState({ searchTerm }) }
        />
        { resultsElem }
        { loadMoreElem }
        { detailsElem }
      </section>
    );
  }

  // --------------------------------------------------
  // LIFECYCLE
  // --------------------------------------------------
  componentDidUpdate(_, prevState) {
    const searchTerm = this.state.searchTerm;
    const prevSearchTerm = prevState.searchTerm;
    const searchType = this.state.searchType;
    const prevSearchType = prevState.searchType;

    if (
      searchTerm
      && (searchTerm !== prevSearchTerm || searchType !== prevSearchType)
    ) {
      if (searchType === 'Characters') {
      this.fetchCharacters();
    } else {
      this.fetchComics();
    }
  }
  }

  // --------------------------------------------------
  // FETCHING CHARACTERS
  // --------------------------------------------------
  fetchCharacters() {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet');
    // TODO:
    // Put the application into a loading state.
    console.log('__PUTTING APP IN LOADING STATE');
    this.setState({isLoading: true});
    // Invoke the `getCharacters()` method on the marvel service.
    // Pass in the current `searchTerm` as `nameStartsWith`,
    console.log('__INVOKING GET CHARACTERS ON MARVEL SERVICE');
    this.marvelService.getCharacters({nameStartsWith: this.state.searchTerm, })
      .then((data) => {
        console.log('__INSIDE AppFetchCharacters() LOGGING OUT DATA')
        console.log(data.data.results);
    // Update the application state using the resulting data.
    // Remove the loading state.
        this.setState({ 
          results: data.data.results, 
          isLoading: false,
          canLoadMore: data.data.total > data.data.offset + data.data.count, });
      })
    // Handle potential errors.
      .catch((err) => {
        console.error(err);
        this.setState({ hasError: true });
      });
  }

  fetchComics() {
    console.log('__PUTTING APP IN LOADING STATE');
    this.setState({isLoading: true});
    console.log('__INVOKING GET COMICS ON MARVEL SERVICE');
    this.marvelService.getComics({titleStartsWith: this.state.searchTerm, })
      .then((data) => {
        console.log('__INSIDE AppFetchComics() LOGGING OUT DATA')
        console.log(data.data.results);
        this.setState({ 
          results: data.data.results, 
          isLoading: false,
          canLoadMore: data.data.total > data.data.offset + data.data.count, });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ hasError: true });
      });
  }

  fetchMoreCharacters() {

    console.log('__INVOKING GET CHARACTERS ON MARVEL SERVICE WITH AN OFFSET');
    this.marvelService.getCharacters({nameStartsWith: this.state.searchTerm, offset: this.state.results.length })
      .then((data) => {
        console.log('__INSIDE AppFetchMoreCharacters() LOGGING OUT DATA')
        console.log(data.data.results);
        this.setState({ 
          results: [...this.state.results, ...data.data.results],
          canLoadMore: data.data.total > data.data.offset + data.data.count, });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ hasError: true });
      });
  }

  fetchMoreComics() {

    console.log('__INVOKING GET CHARACTERS ON MARVEL SERVICE WITH AN OFFSET');
    this.marvelService.getComics({titleStartsWith: this.state.searchTerm, offset: this.state.results.length })
      .then((data) => {
        console.log('__INSIDE AppFetchMoreCharacters() LOGGING OUT DATA')
        console.log(data.data.results);
        this.setState({ 
          results: [...this.state.results, ...data.data.results],
          canLoadMore: data.data.total > data.data.offset + data.data.count, });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ hasError: true });
      });
  }

  fetchCharacter(id) {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet');
    // TODO:
    // Invoke the `getCharacter()` method on the marvel service.
    // Pass in the `id`.
    this.marvelService.getCharacter(id)
    // Update the application state using the resulting data.
      .then((data) => {
        const result = data.results[0];
        this.setState({ selectedResult: result });
      })
    // Handle potential errors.
    .catch((err) => {
      this.setState({ hasError: true });
    });
  }

  fetchComic(id) {

    this.marvelService.getComic(id)
      .then((data) => {
        const result = data.results[0];
        this.setState({ selectedResult: result });
      })
    .catch((err) => {
      this.setState({ hasError: true });
    });
  }
}

export default App;
