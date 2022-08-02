import { Dialog, List, ListItem, ListItemText } from "@mui/material";

// Takes ListItems as children props
export default function CustDialog(props) {
  const { onClose, open } = props;
  console.log(props.listItems);

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <List>
        {props.listItems.map((item, index) => (
          <ListItem
            key={index + item.text}
            button
            onClick={() => handleListItemClick(item.value)}
          >
            <ListItemText primary={item.primary} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
