import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { IconButton, Popover } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const EmojiPickerComponent = ({ onEmojiClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'emoji-popover' : undefined;

  return (
    <div style={{ position: 'absolute' }}>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <SentimentSatisfiedAltIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji) => {
            onEmojiClick(emoji.native);
            handleClose();
          }}
          theme="light"
        />
      </Popover>
    </div>
  );
};

export default EmojiPickerComponent;
