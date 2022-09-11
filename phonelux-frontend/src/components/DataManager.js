import React from 'react'

class DataManager{

    filters = null;

    setFilters = (filters) => {
        this.filters = filters
    }


}


const Data = new DataManager();

export default Data;