import React from 'react';
import MaterialTable from 'material-table';

function SearchBar(){
    const columnas=[
        {
            title:'Ganado',
            field: 'ganado'
        },
        {
            title: 'Procedencia',
            field: 'procedencia'
        }
    ];

    const data= [
        {ganado:'Lola',procedencia:'Guano'},
        {ganado:'pepe',procedencia:'Quimiag'}
    ];
    return (
        <div>
            <MaterialTable
            columns = {columnas}
            data={data}
            />
        </div>
    );
}
export default SearchBar;