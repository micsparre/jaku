import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Anime } from '../Shared/Types';
import Divider from '@mui/material/Divider';

interface SelectedListItemProps {
    selectedIndex: number;
    handleListItemClick: (item: Anime, index: number) => void;
    itemIndex: number;
    item: Anime;
}

const SelectedListItem: React.FC<SelectedListItemProps> = ({selectedIndex, handleListItemClick, itemIndex, item}) => {
  return (
        <div>
        <ListItemButton
          selected={selectedIndex === itemIndex}
          onClick={() => handleListItemClick(item, itemIndex)}
        >
            <ListItemText primary={item.title} />
        </ListItemButton>
        <Divider component="li" />
        </div>
        
  );
};

export default SelectedListItem;