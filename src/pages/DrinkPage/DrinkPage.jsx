import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StyledDrinkPage } from './DrinkPage.styled';
import images from 'src/assets/images/drink-page/images';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Title from '../../components/Title/Title';
import drinksSelectors from '../../redux/drinks/drinkSelectors';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToFavorites,
  deleteFromFavorites,
  fetchDrinkDetails,
} from '../../redux/drinks/drinksOperations.js';
import {
  selectFavoriteCocktails,
  selectIsLoading,
} from '../../redux/selectors';
import { Loader } from '../../components/Loader/Loader';
import ErrorPage from '../ErrorPage/ErrorPage.jsx';
import defaultImg from '../../assets/dummyDrinkThumb.png';

const DrinkPage = () => {
  const dispatch = useDispatch();
  const drinkDetails = useSelector(drinksSelectors.drinkDetails);
  const error = useSelector(drinksSelectors.selectError);
  const isLoading = useSelector(selectIsLoading);
  const favoriteCocktails = useSelector(selectFavoriteCocktails);
  const { id } = useParams();

  const inFavorites = favoriteCocktails.some((cocktail) => cocktail._id === id);

  useEffect(() => {
    dispatch(fetchDrinkDetails(id));
  }, [dispatch, inFavorites]);

  const notifyAdd = () => {
    toast('Drink added to favorites', {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const notifyRemove = () => {
    toast('Drink removed from favorites', {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const handleAddToFavorite = (cocktailId) => {
    dispatch(addToFavorites(cocktailId));
  };

  const handleDeleteFromFavorites = (cocktailId) => {
    dispatch(deleteFromFavorites(cocktailId));
  };

  return (
    <StyledDrinkPage>
      <ToastContainer />
      <div className="container-page">
        {error !== null ? (
          <ErrorPage />
        ) : (
          <div>
            {isLoading === true && <Loader />}
            {drinkDetails !== null && (
              <div>
                <div className="drink-container">
                  <div>
                    <Title text={drinkDetails.drink} />
                    <div className="desc-glass-alco">
                      <span>{drinkDetails.glass}</span>
                      <span> / </span>
                      <span>{drinkDetails.alcoholic}</span>
                    </div>
                    <p className="desc-drink">{drinkDetails.description}</p>
                    {inFavorites ? (
                      <button
                        className="btn-add-rem-fav"
                        onClick={() => {
                          handleDeleteFromFavorites(id);
                          notifyRemove();
                        }}
                      >
                        Remove from favorites
                      </button>
                    ) : (
                      <button
                        className="btn-add-rem-fav"
                        onClick={() => {
                          handleAddToFavorite(id);
                          notifyAdd();
                        }}
                      >
                        Add to favorite drinks
                      </button>
                    )}
                  </div>
                  <img
                    className="img-drink"
                    src={
                      drinkDetails.drinkThumb
                        ? `${drinkDetails.drinkThumb}`
                        : defaultImg
                    }
                    alt={drinkDetails.drink}
                  />
                </div>

                <h2 className="title-sect-ingred">Ingredients</h2>

                <ul className="ingred-list">
                  {drinkDetails.ingredients.map(
                    ({ ingredientId, title, measure }) => (
                      <li className="ingred-item" key={title}>
                        <div className="img-container">
                          <img
                            className="img-ingred"
                            src={
                              ingredientId && ingredientId.ingredientThumb
                                ? ingredientId.ingredientThumb
                                : defaultImg
                            }
                            alt={title}
                          />
                        </div>
                        <div className="ingred-descr">
                          <span className="ingred-name">{title}</span>
                          <span className="ingred-quantity">{measure}</span>
                        </div>
                      </li>
                    )
                  )}
                </ul>

                <h2 className="descr-drink-title">Recipe Preparation</h2>
                <div className="recipe-container">
                  <p className="recipe-text">{drinkDetails.instructions}</p>
                  <picture>
                    <source
                      srcSet={images.drinks_desktop}
                      type="image/jpg"
                      media="(min-width:1200px)"
                      width="631px"
                      height="480px"
                    />
                    <source
                      srcSet={images.drinks_tablet}
                      type="image/jpg"
                      media="(min-width:768px)"
                      width="704px"
                      height="430px"
                    />
                    <source
                      srcSet={images.drinks_mobile}
                      type="image/jpg"
                      media="(min-width:280px)"
                      width="335px"
                      height="430px"
                    />
                    <img
                      src={images.drinks_mobile}
                      alt="three drinks"
                      className="img-three-drinks"
                    />
                  </picture>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </StyledDrinkPage>
  );
};

export default DrinkPage;
