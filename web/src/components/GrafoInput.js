import React from 'react';
import { Paper, TextField, Button } from '@mui/material';

const GrafoInput = ({ entrada, handleEntradaChange, construirGrafo, graficarArbolMinimo, handleOpenDialog }) => {
  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <TextField
        label="Ingresa los nodos y aristas"
        multiline
        rows={6}
        value={entrada}
        onChange={handleEntradaChange}
        fullWidth
        placeholder="Ejemplo:
A,B,C,D,E
A B 3
A C 2
B C 2
B E 6
E D 4
B D 6
A D 13
E C 15"
        variant="outlined"
      />
      <Button
        variant="contained"
        onClick={construirGrafo}
        sx={{ marginTop: 2, marginRight: 2 }}
      >
        Construir Grafo
      </Button>
      <Button
        variant="contained"
        onClick={graficarArbolMinimo}
        sx={{ marginTop: 2, marginRight: 2 }}
      >
        Graficar Árbol Mínimo
      </Button>
      <Button
        variant="contained"
        onClick={() => handleOpenDialog('rutaCorta')}
        sx={{ marginTop: 2, marginRight: 2 }}
      >
        Graficar Ruta Corta
      </Button>
      <Button
        variant="contained"
        onClick={() => handleOpenDialog('flujoMaximo')}
        sx={{ marginTop: 2, marginRight: 2 }}
      >
        Calcular Flujo Máximo
      </Button>
      <Button
        variant="contained"
        onClick={() => handleOpenDialog('costoMinimo')}
        sx={{ marginTop: 2 }}
      >
        Calcular Costo Mínimo
      </Button>
    </Paper>
  );
};

export default GrafoInput;
