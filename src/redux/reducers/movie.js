const movieReducer = (movie = [], action) => {
    switch (action.type) {
        case "FETCH_MOVIES":
            return [action.payload.results, action.payload.total_results, action.payload.total_pages];
        default:
            return movie;
    }
};

export default movieReducer;