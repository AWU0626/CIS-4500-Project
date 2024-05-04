import { useState } from 'react';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

const StyledButton = styled(Button)({
    width: 30,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    '&:hover': {
      width: 120,
    },
    transition: '0.5s',
  });
  
  export const HoverButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <StyledButton
        variant="contained"
        color="primary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <SearchIcon />
        <span style={{ transition: '0.5s'}}>
          {isHovered ? 'Search' : ''}
        </span>
      </StyledButton>
    );
  };