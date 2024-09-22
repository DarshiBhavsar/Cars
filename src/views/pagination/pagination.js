import React, { useState } from 'react';
import '../pagination/pagination.css'
import { CButton } from '@coreui/react';

const Pagination = ({ totalPost, postPerPage, setCurrentPage }) => {
    const [activePage, setActivePage] = useState(1);
    const totalPages = Math.ceil(totalPost / postPerPage);
    let pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    const handlePageClick = (page) => {
        setCurrentPage(page);
        setActivePage(page);
    };

    const handlePrevious = () => {
        if (activePage > 1) {
            handlePageClick(activePage - 1);
        }
    };

    const handleNext = () => {
        if (activePage < totalPages) {
            handlePageClick(activePage + 1);
        }
    };

    return (
        <div className="pagination-container">
            <CButton
                style={{ width: '100px', height: '35px', backgroundColor: '#4B49B6', color: 'white', borderRadius: '20px' }}
                onClick={handlePrevious}
                disabled={activePage === 1} // Disable if on the first page
                className={activePage === 1 ? 'disabled' : ''}
            >
                Previous
            </CButton>

            {
                pages.map((page, index) => {
                    return (
                        <CButton
                            style={{ fontSize: '20px', padding: '15px 20px' }}
                            key={index}
                            onClick={() => handlePageClick(page)}
                            className={activePage === page ? 'active' : ''}
                        >
                            {page}
                        </CButton>
                    );
                })
            }

            <CButton
                style={{ width: '100px', height: '35px', backgroundColor: '#4B49B6', color: 'white', borderRadius: '20px' }}
                onClick={handleNext}
                disabled={activePage === totalPages} // Disable if on the last page
                className={activePage === totalPages ? 'disabled' : ''}
            >
                Next
            </CButton>
        </div>
    );
};

export default Pagination;
