import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const DialogForm = ({ openDialog, handleCloseDialog, dialogType, inputValue, handleInputChange, inputValue2, handleInputChange2, handleDialogSubmit }) => {
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>{dialogType === 'rutaCorta' ? 'Graficar Ruta Corta' : dialogType === 'flujoMaximo' ? 'Calcular Flujo Máximo' : 'Calcular Costo Mínimo'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nodo de Origen"
          value={inputValue}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          inputProps={{ style: { textTransform: 'uppercase' } }}
        />
        <TextField
          label="Nodo de Destino"
          value={inputValue2}
          onChange={handleInputChange2}
          fullWidth
          margin="dense"
          inputProps={{ style: { textTransform: 'uppercase' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancelar</Button>
        <Button onClick={handleDialogSubmit}>Aceptar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogForm;
