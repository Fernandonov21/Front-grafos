import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import GrafoSVG from './GrafoVisual';
import ArbolExpansionMinima from './ArbolExpansionMinima';

const GrafoDisplay = ({ grafoData, arbolMinimo, rutaCorta, flujoMaximo, costoMinimo }) => {
  return (
    <>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Grafo Principal
        </Typography>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          {grafoData.nodes.length > 0 ? (
            <GrafoSVG nodes={grafoData.nodes} links={grafoData.links} />
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 10 }}>
              No hay datos para mostrar. Ingresa nodos y aristas.
            </Typography>
          )}
        </Box>
      </Paper>
      {arbolMinimo && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Árbol de Expansión Mínima
          </Typography>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <ArbolExpansionMinima nodes={arbolMinimo.nodes} links={arbolMinimo.links} />
          </Box>
        </Paper>
      )}
      {rutaCorta && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ruta Más Corta
          </Typography>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <GrafoSVG nodes={grafoData.nodes} links={rutaCorta} />
          </Box>
        </Paper>
      )}
      {flujoMaximo && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Flujo Máximo
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            {flujoMaximo}
          </Typography>
        </Paper>
      )}
      {costoMinimo && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Costo Mínimo
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            {costoMinimo}
          </Typography>
        </Paper>
      )}
    </>
  );
};

export default GrafoDisplay;
