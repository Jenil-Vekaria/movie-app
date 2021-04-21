import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MovieCard } from '../MovieCard/MovieCard';
import { MovieCategory } from '../MovieCategory/MovieCategory';
import { useDispatch } from 'react-redux';
import { getPopular, getLatest, getTopRated, getUpcoming, getByGenre, getMovie } from '../../../redux/actions/movie';
import { WindowSize } from '../../../util/WindowSize';

import './styles.css';
import { Pagination } from '../../Pagination/Pagination';

export const MovieList = ({ selectedGenre, showFilter, setShowFilter, queryMovieSearch, pageNumber }) => {
    const [categoryIndex, setCategoryIndex] = useState(0);
    const windowWidth = WindowSize();
    const dispatch = useDispatch();

    useEffect(() => {
        if (queryMovieSearch) {
            dispatch(getMovie(queryMovieSearch, pageNumber));
        }
        else if (typeof selectedGenre.id !== "undefined") {
            dispatch(getByGenre(selectedGenre.id, pageNumber));
        }
        else {
            switch (categoryIndex) {
                case 0:
                    dispatch(getPopular(pageNumber));
                    break;
                case 1:
                    dispatch(getTopRated(pageNumber));
                    break;
                case 2:
                    dispatch(getUpcoming(pageNumber));
                    break;
                case 3:
                    dispatch(getLatest(pageNumber));
                    break;
                default:
                    dispatch(getPopular(pageNumber));
                    break;
            }
        }
    }, [categoryIndex, dispatch, selectedGenre, queryMovieSearch, pageNumber]);

    const handleCategoryChange = (index) => {
        if (index !== categoryIndex) {
            setCategoryIndex(index);
        }
    };

    const movies = useSelector((state) => state.movie[0]) || [];
    const total_result = useSelector((state) => state.movie[1]) || 0;
    const total_page = useSelector((state) => state.movie[2]) || 0;
    // This is to stop scroll for mvoie when filter box is open
    const style = {
        position: "fixed"
    };

    //Responsive design: Breakpoint for moveicard
    const getBreakpointClass = () => {
        if (windowWidth <= 540)
            return 'row-cols-1';
        else if (windowWidth <= 900)
            return 'row-cols-2';
        else if (windowWidth <= 960)
            return 'row-cols-4';
        else
            return 'row-cols-5';
    };

    const movieCardClass = getBreakpointClass();

    return (
        <div className="movies-container" style={windowWidth < 750 && showFilter ? style : null}>
            <MovieCategory
                selectedGenre={selectedGenre}
                categoryIndex={categoryIndex}
                handleCategoryChange={handleCategoryChange}
                setShowFilter={setShowFilter}
                totalResult={total_result}
                queryMovieSearch={queryMovieSearch} />

            <br />
            {
                typeof movies === undefined || movies.length === 0
                    ?
                    (
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )
                    :
                    (
                        <div className={`row ${movieCardClass}`}>
                            {
                                movies.map(movie => (
                                    <MovieCard movie={movie} key={movie.id} />
                                ))
                            }
                        </div>
                    )
            }

            <Pagination totalPage={total_page} pageNumber={pageNumber} />
        </div>
    );
};
