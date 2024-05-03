import React from 'react';
import {Button} from "@mui/material";

const PageNavigator = ({currentPage, totalPages, onPageChange}) => {
  return (
    <div>
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="pageNavigatorButton"
      >
        ⏪️
      </Button>
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="pageNavigatorButton"
      >
        ⬅️
      </Button>
      <span className="pageNavigatorInfo">
        {currentPage} / {totalPages}
      </span>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="pageNavigatorButton"
      >
        ➡️
      </Button>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="pageNavigatorButton"
      >
        ⏩️
      </Button>
    </div>
  );
};

export default PageNavigator