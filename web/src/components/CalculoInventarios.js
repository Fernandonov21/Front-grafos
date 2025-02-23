import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import axios from 'axios';

const CalculoInventarios = () => {
  const [demandaAnual, setDemandaAnual] = useState('');
  const [costoOrden, setCostoOrden] = useState('');
  const [costoMantener, setCostoMantener] = useState('');
  const [eoq, setEoq] = useState(null);

  const handleCalcularEOQ = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL_INVENTARIOS}/calcular-eoq`, {
        demanda_anual: demandaAnual,
        costo_orden: costoOrden,
        costo_mantener: costoMantener,
      });
      setEoq(response.data.eoq);
    } catch (error) {
      console.error('Error calculando el EOQ:', error);
      alert(`Error calculando el EOQ: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Container>
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Cálculo de Inventarios (EOQ)
        </Typography>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <TextField
            label="Demanda Anual"
            value={demandaAnual}
            onChange={(e) => setDemandaAnual(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          />
          <TextField
            label="Costo por Orden"
            value={costoOrden}
            onChange={(e) => setCostoOrden(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          />
          <TextField
            label="Costo de Mantener"
            value={costoMantener}
            onChange={(e) => setCostoMantener(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={handleCalcularEOQ}
            sx={{ marginTop: 2 }}
          >
            Calcular EOQ
          </Button>
        </Paper>
        {eoq !== null && (
          <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resultado EOQ
            </Typography>
            <Typography variant="body1">
              El Lote Económico de Pedido (EOQ) es: {eoq}
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default CalculoInventarios;
