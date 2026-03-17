import moment from 'moment';
import React, { useState } from 'react';

export default function TableList({ data, columns, onRowClick }) {
    if (!data) {
        return <p>Error list..</p>;
    }

    // Helper function to get nested object values
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };


    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = data.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );


    return (
        <>
        <div className="tableList mt-3 mb-1">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className='tableBody'>
                    {paginatedData.map((row, rowIndex) => (
                        <tr key={rowIndex} onClick={() => onRowClick(row)} className='table-row'>
                            {columns.map((col, colIndex) => {
                                
                                if(col.type == "text") {
                                    const text = String(getNestedValue(row, col.field) || '');
                                    return (
                                        <td key={colIndex}>
                                            {text}
                                        </td>
                                    )
                                } else if (col.type == "date") {
                                    return (
                                        <td key={colIndex}>
                                            {getNestedValue(row, col.field) ? moment(getNestedValue(row, col.field)).format('YYYY-MM-DD') : ''}
                                        </td>
                                    )
                                } else if (col.type == "switch") {
                                    return (
                                        <td key={colIndex}>
                                            <input type="checkbox" checked={getNestedValue(row, col.field) || false} readOnly className='checkBoxList'/>
                                        </td>
                                    )
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination d-flex justify-content-center mb-1">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button 
                    key={index}
                    className={`tablePageBtn btn btn-sm mx-1 ${currentPage === index && ' activePage'}`}
                    onClick={() => setCurrentPage(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
        </>
    )
}