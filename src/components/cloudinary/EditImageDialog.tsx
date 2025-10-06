import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface EditImageDialogProps {
  open: boolean;
  newName: string;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onConfirm: () => void;
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({
  open,
  newName,
  onClose,
  onNameChange,
  onConfirm,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rename Image</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="New Name"
          fullWidth
          variant="outlined"
          value={newName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained">
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditImageDialog;