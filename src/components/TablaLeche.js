import { Cancel, CheckCircle, FilterAlt, Visibility } from '@mui/icons-material';
import { Button, Divider, Grid, Tooltip, Typography } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function TablaLeche() {

  const navigate = useNavigate();

  const [dataPoints, setDataPoints] = React.useState([])
  const [data, setData] = React.useState([])
  const [vacios, setVacios] = React.useState([])
  const [aux, setAux] = React.useState([])
  const [filtro, setFiltro] = React.useState(false)
  const columns = ["Fecha de registro", "Total sobrante (litros)", "Total terneros (litros)", {
    name: "¿Hubo registros?",
    options: {
      filter: true,
      customBodyRenderLite: (dataIndex, rowIndex) => {
        return (
          <div>
            {(aux[dataIndex][1] == 0 && aux[dataIndex][2] == 0) &&
              <Grid container direction="row" alignItems="center">
                <Grid item style={{ marginRight: '3%' }}>
                  <Cancel style={{ color: 'red' }} />
                </Grid>
                <Grid item>
                  <Typography color='red'>
                    No Cumple
                  </Typography>
                </Grid>
              </Grid>}

            {(aux[dataIndex][1] != 0 || aux[dataIndex][2] != 0) &&
              <Grid container direction="row" alignItems="center">
                <Grid item style={{ marginRight: '3%' }}>
                  <CheckCircle style={{ color: 'green' }} />
                </Grid>
                <Grid item>
                  <Typography color='green'>
                    Cumple
                  </Typography>
                </Grid>
              </Grid>}
          </div>
        )
      }
    }
  }, {
      name: "",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Button style={{}} variant="text" onClick={() => navigate('/content/leche/ver/' + aux[dataIndex][0].replace(/-/g, ''))}>
              Ver
              <Visibility style={{ marginLeft: '10%' }} />

            </Button>
          )
        }
      }
    }]

  const options = {
    selectableRows: false,
    selectableRowsHeader: false,
    filter: 'false',
    download: 'false',
    print: 'false',
    textLabels: {
      body: {
        noMatch: 'No se han ingresado registros todavía',
      }
    },
    serverSide: false
  }

  React.useEffect(() => {
    const urlRegistros = "http://192.168.0.88:8080/leche/registros"

    const fetchRegistrosLecheTodos = async () => {
      try {
        const response = await fetch(urlRegistros, {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        });
        const json = await response.json();
        var finalData = []
        var finalVacios = []
        json.forEach(registro => {
          var singleData = []
          var singleVacios = []
          registro.fechaRegistro = registro.fechaRegistro.substring(0, 10)
          singleData.push(registro.fechaRegistro)
          singleData.push(registro.totalSobrante)
          singleData.push(registro.totalTernero)
          finalData.push(singleData)

          if (registro.totalSobrante == 0 && registro.totalTernero == 0) {
            singleVacios.push(registro.fechaRegistro)
            singleVacios.push(registro.totalSobrante)
            singleVacios.push(registro.totalTernero)
            finalVacios.push(singleData)
          }
        })
        setDataPoints(json.reverse())
        setData(finalData)
        setVacios(finalVacios)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchPrimera = async () => {
      try {
        const response = await fetch(urlRegistros, {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        });
        const json = await response.json();
        var finalData = []
        var finalVacios = []
        json.forEach(registro => {
          var singleData = []
          var singleVacios = []
          registro.fechaRegistro = registro.fechaRegistro.substring(0, 10)
          singleData.push(registro.fechaRegistro)
          singleData.push(registro.totalSobrante)
          singleData.push(registro.totalTernero)
          finalData.push(singleData)

          if (registro.totalSobrante == 0 && registro.totalTernero == 0) {
            singleVacios.push(registro.fechaRegistro)
            singleVacios.push(registro.totalSobrante)
            singleVacios.push(registro.totalTernero)
            finalVacios.push(singleData)
          }
        })
        setAux(finalData)
        setDataPoints(json.reverse())
        setData(finalData)
        setVacios(finalVacios)
      } catch (error) {
        console.log(error)
      }
    }

    fetchPrimera()

    const interval = setInterval(() => {
      fetchRegistrosLecheTodos()
    }, 5000)

    return () => clearInterval(interval)

  }, [])

  return (
    <div style={{ padding: '5%' }}>
      <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Leche </Typography>

      <Divider sx={{ marginBottom: '30px' }} />

      <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> PRODUCCIÓN DE LECHE A LO LARGO DEL TIEMPO 📈 </Typography>
      <ResponsiveContainer width={'100%'} height={300}>
        <LineChart
          width={500}
          height={300}
          data={dataPoints}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fechaRegistro" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalTernero" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="totalSobrante" stroke="green" />
        </LineChart>
      </ResponsiveContainer>

      <Divider sx={{ marginBottom: '20px', marginTop: '20px' }} />

      <Grid container direction='row' style={{ marginBottom: '20px' }}>
        <Grid item xs={9.75}>
          <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> REGISTROS DE LECHE - TODOS 📆 </Typography>
        </Grid>

        {!filtro &&
          <Grid item xs={2.25}>
            <Button style={{ background: 'green', width: '100%' }} variant="contained" onClick={() => {
              setAux(vacios)
              setFiltro(true)
            }}>
              <FilterAlt style={{ marginRight: '10%' }} />
              Filtrar no cumple
            </Button>
          </Grid>}

        {filtro &&
          <Grid item xs={2.25}>
            <Button style={{ background: 'green', width: '100%' }} variant="contained" onClick={() => {
              setAux(data)
              setFiltro(false)
            }}>
              <FilterAlt style={{ marginRight: '10%' }} />
              Filtrar todos
            </Button>
          </Grid>}

      </Grid>

      <MUIDataTable
        data={aux}
        columns={columns}
        options={options}
      />

    </div>
  )
}