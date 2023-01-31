import * as React from 'react';
import { Divider, Grid, Typography } from '@mui/material'
import { Button } from '@mui/material'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import { Edit } from '@mui/icons-material';

export default function Ganado() {

  const [dataGanado, setDataGanado] = React.useState([])
  const [dataActual, setDataActual] = React.useState([])
  const [dataHistorico, setDataHistorico] = React.useState([])
  const navigate = useNavigate();

  const columnsGanado = ["Id de la vaca", "Nombre", "Raza", "Sexo", "Estado", {
    name: "",
    options: {
      filter: false,
      customBodyRenderLite: (dataIndex, rowIndex) => {
        return (
          <Button style={{}} variant="text" onClick={() => navigate('/content/ganado/ver/' + dataGanado[dataIndex][0])}>
            Ver
            <VisibilityIcon style={{ marginLeft: '10%' }} />

          </Button>
        )
      }
    }
  }]

  const columnsActual = ["Id proceso", "Nombre vaca", "Id vaca", "Inseminacion", {
    name: "",
    options: {
      filter: false,
      customBodyRenderLite: (dataIndex, rowIndex) => {
        return (
          <Button style={{}} variant="text" onClick={() => navigate('/content/ganado/prenez/' + dataActual[dataIndex][0])}>
            Finalizar
            <Edit style={{ marginLeft: '10%' }} />

          </Button>
        )
      }
    }
  }]

  const columnsHistorico = ["Id proceso", "Nombre vaca", "Id vaca", "Inseminación", "Fin de proceso", "Estado"]

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

  const optionsActual = {
    selectableRows: false,
    selectableRowsHeader: false,
    filter: 'false',
    download: 'false',
    print: 'false',
    textLabels: {
      body: {
        noMatch: 'No hay procesos actuales',
      }
    },
    serverSide: false
  }

  const optionsHistorico = {
    selectableRows: false,
    selectableRowsHeader: false,
    filter: 'false',
    download: 'false',
    print: 'false',
    textLabels: {
      body: {
        noMatch: 'No se han registrado procesos todavía',
      }
    },
    serverSide: false
  }

  React.useEffect(() => {
    const url = "http://192.168.0.88:8080/ganado"
    const urlPrenez = 'http://192.168.0.88:8080/prenez'

    const fetchGanado = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        });
        const json = await response.json();
        var finalData = []
        json.forEach(registro => {
          var singleData = []
          singleData.push(registro.id)
          singleData.push(registro.nombre)
          singleData.push(registro.raza.raza)
          singleData.push(registro.sexo == 'M' ? 'Macho' : 'Hembra')
          singleData.push(registro.estado)
          finalData.push(singleData)
        })
        setDataGanado(finalData)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchPrenez = async () => {
      try {
        const response = await fetch(urlPrenez, {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        });
        const json = await response.json();
        var finalData = []
        var finalDataHistorico = []
        json.forEach(registro => {
          var singleData = []
          if (registro.estado.toUpperCase() == 'PRENADA') {
            singleData.push(registro.id)
            singleData.push(registro.cabezaGanado.nombre)
            singleData.push(registro.cabezaGanado.id)
            singleData.push(registro.fechaInseminacion.substring(0,10))
            finalData.push(singleData)
          } else {
            singleData.push(registro.id)
            singleData.push(registro.cabezaGanado.nombre)
            singleData.push(registro.cabezaGanado.id)
            singleData.push(registro.fechaInseminacion.substring(0,10))
            singleData.push(registro.fechaParto == null ? "na" : registro.fechaParto.substring(0,10))
            singleData.push(registro.estado)
            finalDataHistorico.push(singleData)
          }
        })
        setDataActual(finalData)
        setDataHistorico(finalDataHistorico)
      } catch (error) {
        console.log(error)
      }
    }

    fetchGanado()
    fetchPrenez()
  }, [])

  return (

    <div style={{ padding: '5%' }}>

      <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Ganado </Typography>

      <Divider sx={{ marginBottom: '30px' }} />

      <Grid container direction='row' style={{ marginBottom: '20px' }}>
        <Grid item xs={11}>
          <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> CABEZAS DE GANADO REGISTRADAS 🐄 </Typography>
        </Grid>

        <Grid item xs={1}>
          <Button style={{ background: 'green' }} variant="contained" onClick={() => navigate('/content/nuevo')}>
            <AddCircleRoundedIcon style={{ marginRight: '10%' }} />
            Nuevo
          </Button>
        </Grid>
      </Grid>

      <MUIDataTable
        data={dataGanado}
        columns={columnsGanado}
        options={options}
      />

      <Divider sx={{ marginBottom: '30px' }} />

      <Grid container direction='row' style={{ marginBottom: '20px' }}>
        <Grid item xs={11}>
          <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> PROCESOS DE PREÑEZ - ACTUALES 🔔 </Typography>
        </Grid>
      </Grid>

      <MUIDataTable
        data={dataActual}
        columns={columnsActual}
        options={optionsActual}
      />

      <Divider sx={{ marginBottom: '30px' }} />

      <Grid container direction='row' style={{ marginBottom: '20px' }}>
        <Grid item xs={11}>
          <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> PROCESOS DE PREÑEZ - HISTÓRICO 📆 </Typography>
        </Grid>
      </Grid>

      <MUIDataTable
        data={dataHistorico}
        columns={columnsHistorico}
        options={optionsHistorico}
      />

    </div>


  )

}