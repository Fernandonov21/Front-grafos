import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import GrafoSVG from './GrafoVisual';
import ArbolExpansionMinima from './ArbolExpansionMinima';

const GrafoDisplay = ({ grafoData, arbolMinimo, rutaCorta, flujoMaximo, costoMinimo, analisisSensibilidadResultados, interpretacion }) => {
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
      {analisisSensibilidadResultados && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Análisis de Sensibilidad
          </Typography>
          {analisisSensibilidadResultados.map((resultado, index) => (
            <Box key={index} sx={{ marginTop: 2 }}>
              {resultado.costo_original !== undefined && (
                <Typography>
                  Costo original: {resultado.costo_original}
                </Typography>
              )}
              {resultado.arista && (
                <Typography>
                  Arista: {resultado.arista} - Nuevo costo: {resultado.nuevo_costo} - Nuevo costo mínimo: {resultado.nuevo_costo_minimo}
                </Typography>
              )}
              {resultado.error && (
                <Typography color="error">
                  Error: {resultado.error}
                </Typography>
              )}
            </Box>
          ))}
          {interpretacion && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6">Interpretación</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {interpretacion}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </>
  );
};

export default GrafoDisplay;
