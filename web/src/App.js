import React, { useState } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GrafoInput from './components/GrafoInput';
import GrafoDisplay from './components/GrafoDisplay';
import DialogForm from './components/DialogForm';
import CalculoInventarios from './components/CalculoInventarios';
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
          weight: parseInt(weight) || 1,
        };
      });

      const response = await axios.post('http://100.29.123.169:5000/construir_grafo', {
        nodos,
        aristas: aristas.map((arista) => [arista.source, arista.target, arista.weight]),
        dirigido: true,
      });
      console.log(response.data.message);

      setGrafoData({
        nodes: nodos.map((id) => ({ id })),
        links: aristas,
      });
      setArbolMinimo(null);
      setRutaCorta(null);
      setFlujoMaximo(null);
      setCostoMinimo(null);
    } catch (error) {
      console.error('Error construyendo el grafo:', error);
    }
  };

  const graficarArbolMinimo = async () => {
    try {
      const response = await axios.get('http://100.29.123.169:5000/graficar_arbol_minimo');
      const arbol = response.data.arbol;
      const nodos = [...new Set(arbol.flatMap(edge => [edge[0], edge[1]]))];
      setArbolMinimo({
        nodes: nodos.map((id) => ({ id })),
        links: arbol.map(([source, target, weight]) => ({ source, target, weight: weight.peso }))
      });
      setRutaCorta(null);
    } catch (error) {
      console.error('Error graficando el árbol mínimo:', error);
      alert(`Error graficando el árbol mínimo: ${error.response?.data?.error || error.message}`);
    }
  };

  const graficarRutaCorta = async (origen, destino) => {
    if (origen && destino) {
      try {
        const response = await axios.post('http://100.29.123.169:5000/graficar_ruta_corta', {
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
        setArbolMinimo(null);
      } catch (error) {
        console.error('Error graficando la ruta corta:', error);
      }
    }
  };

  const calcularFlujoMaximo = async (fuente, sumidero) => {
    if (fuente && sumidero) {
      try {
        const nodos = grafoData.nodes.map(node => node.id);
        if (!nodos.includes(fuente) || !nodos.includes(sumidero)) {
          throw new Error('Los nodos fuente y sumidero deben existir en el grafo');
        }

        const response = await axios.post('http://100.29.123.169:5000/calcular_flujo_maximo', {
          fuente,
          sumidero,
        });
        setFlujoMaximo(`El flujo máximo de ${fuente} a ${sumidero} es: ${response.data.flujo_maximo}`);
        setArbolMinimo(null);
        setRutaCorta(null);
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
        const response = await axios.post('http://100.29.123.169:5000/calcular_costo_minimo', {
          origen,
          destino,
        });
        setCostoMinimo(`El costo mínimo de ${origen} a ${destino} es: ${response.data.costo_minimo}`);
        setArbolMinimo(null);
        setRutaCorta(null);
      } catch (error) {
        console.error('Error calculando el costo mínimo:', error);
      }
    }
  };

  return (
    <Router>
      <Container>
        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Visualizador de Grafos
          </Typography>
          <Button component={Link} to="/" variant="contained" sx={{ marginRight: 2 }}>
            Home
          </Button>
          <Button component={Link} to="/calculo-inventarios" variant="contained">
            Calcular Inventarios
          </Button>
          <Routes>
            <Route exact path="/" element={
              <>
                <GrafoInput
                  entrada={entrada}
                  handleEntradaChange={handleEntradaChange}
                  construirGrafo={construirGrafo}
                  graficarArbolMinimo={graficarArbolMinimo}
                  handleOpenDialog={handleOpenDialog}
                />
                <GrafoDisplay
                  grafoData={grafoData}
                  arbolMinimo={arbolMinimo}
                  rutaCorta={rutaCorta}
                  flujoMaximo={flujoMaximo}
                  costoMinimo={costoMinimo}
                />
              </>
            } />
            <Route path="/calculo-inventarios" element={<CalculoInventarios />} />
          </Routes>
        </Box>
        <DialogForm
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          dialogType={dialogType}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          inputValue2={inputValue2}
          handleInputChange2={handleInputChange2}
          handleDialogSubmit={handleDialogSubmit}
        />
      </Container>
    </Router>
  );
};

export default App;