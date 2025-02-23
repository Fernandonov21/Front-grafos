import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import GrafoSVG from './components/GrafoVisual';
import ArbolExpansionMinima from './components/ArbolExpansionMinima';
import axios from 'axios';

const App = () => {
  const [entrada, setEntrada] = useState('');
  const [grafoData, setGrafoData] = useState({ nodes: [], links: [] });
  const [arbolMinimo, setArbolMinimo] = useState(null);
  const [rutaCorta, setRutaCorta] = useState(null);
  const [flujoMaximo, setFlujoMaximo] = useState(null);
  const [costoMinimo, setCostoMinimo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setInputValue('');
    setInputValue2('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
  };

  const handleInputChange2 = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue2(value);
  };

  const handleEntradaChange = (e) => {
    const value = e.target.value.toUpperCase();
    setEntrada(value);
  };

  const handleDialogSubmit = async () => {
    if (dialogType === 'rutaCorta') {
      await graficarRutaCorta(inputValue, inputValue2);
    } else if (dialogType === 'flujoMaximo') {
      await calcularFlujoMaximo(inputValue, inputValue2);
    } else if (dialogType === 'costoMinimo') {
      await calcularCostoMinimo(inputValue, inputValue2);
    }
    handleCloseDialog();
  };

  const construirGrafo = async () => {
    try {
      const lineas = entrada.split('\n');
      const nodos = lineas[0].split(',').map((nodo) => nodo.trim());
      const aristas = lineas.slice(1).map((linea) => {
        const [source, target, weight] = linea.trim().split(' ');
        return {
          source: source.trim(),
          target: target.trim(),
          weight: parseInt(weight) || 1, // Peso de la arista (default: 1)
        };
      });

      // Enviar datos al backend para construir el grafo dirigido
      const response = await axios.post('http://127.0.0.1:5000/construir_grafo', {
        nodos,
        aristas: aristas.map((arista) => [arista.source, arista.target, arista.weight]),
        dirigido: true, // Indicar que el grafo es dirigido
      });
      console.log(response.data.message);

      // Actualizar el estado con los datos del grafo
      setGrafoData({
        nodes: nodos.map((id) => ({ id })), // Nodos con formato { id: 'A' }
        links: aristas, // Aristas con formato { source, target, weight }
      });
      setArbolMinimo(null); // Limpiar el árbol de expansión mínima
      setRutaCorta(null); // Limpiar la ruta más corta
      setFlujoMaximo(null); // Limpiar el flujo máximo
      setCostoMinimo(null); // Limpiar el costo mínimo
    } catch (error) {
      console.error('Error construyendo el grafo:', error);
    }
  };

  const graficarArbolMinimo = async () => {
    try {
      // Solicitar el árbol de expansión mínima al backend
      const response = await axios.get('http://127.0.0.1:5000/graficar_arbol_minimo');
      const arbol = response.data.arbol;
      const nodos = [...new Set(arbol.flatMap(edge => [edge[0], edge[1]]))]; // Extract unique nodes from edges
      setArbolMinimo({
        nodes: nodos.map((id) => ({ id })), // Nodos con formato { id: 'A' }
        links: arbol.map(([source, target, weight]) => ({ source, target, weight: weight.peso }))
      });
      setRutaCorta(null); // Limpiar la ruta más corta
    } catch (error) {
      console.error('Error graficando el árbol mínimo:', error);
      alert(`Error graficando el árbol mínimo: ${error.response?.data?.error || error.message}`);
    }
  };

  const graficarRutaCorta = async (origen, destino) => {
    if (origen && destino) {
      try {
        // Solicitar la ruta más corta al backend
        const response = await axios.post('http://127.0.0.1:5000/graficar_ruta_corta', {
          origen,
          destino,
        });
        const ruta = response.data.ruta;
        if (!ruta) {
          throw new Error('No se encontró la ruta');
        }
        const links = [];
        for (let i = 0; i < ruta.length - 1; i++) {
          const source = ruta[i];
          const target = ruta[i + 1];
          const weight = grafoData.links.find(link => (link.source === source && link.target === target) || (link.source === target && link.target === source)).weight;
          links.push({ source, target, weight });
        }
        setRutaCorta(links);
        setArbolMinimo(null); // Limpiar el árbol de expansión mínima
      } catch (error) {
        console.error('Error graficando la ruta corta:', error);
      }
    }
  };

  const calcularFlujoMaximo = async (fuente, sumidero) => {
    if (fuente && sumidero) {
      try {
        // Verificar que los nodos fuente y sumidero existen en el grafo
        const nodos = grafoData.nodes.map(node => node.id);
        if (!nodos.includes(fuente) || !nodos.includes(sumidero)) {
          throw new Error('Los nodos fuente y sumidero deben existir en el grafo');
        }

        // Solicitar el flujo máximo al backend
        const response = await axios.post('http://127.0.0.1:5000/calcular_flujo_maximo', {
          fuente,
          sumidero,
        });
        setFlujoMaximo(`El flujo máximo de ${fuente} a ${sumidero} es: ${response.data.flujo_maximo}`);
        setArbolMinimo(null); // Limpiar el árbol de expansión mínima
        setRutaCorta(null); // Limpiar la ruta más corta
      } catch (error) {
        console.error('Error calculando el flujo máximo:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          alert(`Error calculando el flujo máximo: ${error.response.data.error || error.message}`);
        } else {
          alert(`Error calculando el flujo máximo: ${error.message}`);
        }
      }
    }
  };

  const calcularCostoMinimo = async (origen, destino) => {
    if (origen && destino) {
      try {
        // Solicitar el costo mínimo al backend
        const response = await axios.post('http://127.0.0.1:5000/calcular_costo_minimo', {
          origen,
          destino,
        });
        setCostoMinimo(`El costo mínimo de ${origen} a ${destino} es: ${response.data.costo_minimo}`);
        setArbolMinimo(null); // Limpiar el árbol de expansión mínima
        setRutaCorta(null); // Limpiar la ruta más corta
      } catch (error) {
        console.error('Error calculando el costo mínimo:', error);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Visualizador de Grafos
        </Typography>
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
      </Box>
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
    </Container>
  );
};

export default App;