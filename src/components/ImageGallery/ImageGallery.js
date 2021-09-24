import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

import imageAPI from '../../services/apiService';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import s from './ImageGallery.module.css';

function ImageGallery({ searchQuery, page, clickButton }) {
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [largeImageURL, setLargeImageURL] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    if (page === 1) {
      setStatus('pending');
      imageAPI
        .fetchGallery(searchQuery, page)
        .then(images => {
          if (images.total > 0) {
            setPictures(images.hits);
            setStatus('resolved');
          } else {
            setError(`Not found ${searchQuery}`);
            setStatus('rejected');
          }
        })
        .catch(error => {
          setError(error);
          setStatus('rejected');
        });
    } else {
      imageAPI
        .fetchGallery(searchQuery, page)
        .then(images => {
          setPictures(prevState => [...prevState, ...images.hits]);
          setStatus('resolved');
        })
        .then(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        })
        .catch(error => {
          setError(error);
          setStatus('rejected');
        });
    }
  }, [searchQuery, page]);

  const onOpenModal = (imageURL, alt) => {
    setLargeImageURL(imageURL);
    setAlt(alt);
  };

  const onCloseModal = () => {
    setLargeImageURL('');
    setAlt('');
  };

  if (status === 'idle') {
    return <p>Enter something</p>;
  }

  if (status === 'pending') {
    return (
      <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={80}
        width={80}
        timeout={3000}
      />
    );
  }

  if (status === 'rejected') {
    return <p>{error}</p>;
  }

  if (status === 'resolved') {
    return (
      <div>
        <ul className={s.ImageGallery}>
          {pictures.map(picture => (
            <ImageGalleryItem
              key={picture.id}
              webformatURL={picture.webformatURL}
              largeImageURL={picture.largeImageURL}
              alt={picture.tags}
              onOpenModal={onOpenModal}
            />
          ))}
        </ul>
        <Button onClick={clickButton} />
        {largeImageURL && (
          <Modal
            largeImageURL={largeImageURL}
            alt={alt}
            onClose={onCloseModal}
          />
        )}
      </div>
    );
  }
}

ImageGallery.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  clickButton: PropTypes.func.isRequired,
};

export { ImageGallery };
