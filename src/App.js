import { useState } from 'react';

import { Searchbar } from './components/Searchbar/Searchbar';
import { ImageGallery } from './components/ImageGallery/ImageGallery';

import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const handleFormSubmit = query => {
    setSearchQuery(query);
    resetPage();
  };

  const nextPage = () => {
    return setPage(prevState => prevState + 1);
  };

  const resetPage = () => {
    return setPage(1);
  };

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery
        searchQuery={searchQuery}
        page={page}
        clickButton={nextPage}
      />
    </div>
  );
}

export default App;
