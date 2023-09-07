import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import '../css/main.css'
import { estadios } from './estadios';
import estadio from '../image/estadio.png'


export const MapStadium = () => {

  const [data, setData] = useState(null);
  const claveApi = '30f3a4ca9d5a4679a03678438ffa439a'

  console.log(estadios);

  useEffect(() => {

    //Centramos coordenadas del mapa en España
    const centrarCoordenadas = [-385829.7235784164, 4885295.083634573];

    //Configuración del mapa:

    //Configuramos mapa base.
    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    //centro de coordenadas y zoom con el que se inicia.
    const view = new View({
      center: centrarCoordenadas,
      zoom: 6,
    });

    //Creamos instancia.
    const olMap = new Map({
      layers: [baseLayer],
      target: 'map',
      view: view,
    });


    //evento click para recoger las coordenadas del usuario al clickar
    olMap.on('click', async (e) => {
      const coordenadas = e.coordinate;
      const coordenadasConvertidas = transform(coordenadas, 'EPSG:3857', 'EPSG:4326');

      //Hacemos petición a la api de OpenCage para recoger datos por coordenadas
      try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${claveApi}&q=${coordenadasConvertidas[1]}+${coordenadasConvertidas[0]}`);

        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }

        const datos = await response.json();
        const resultados = datos.results;
        console.log(resultados);
        if (resultados.length > 0) {
          const comunidad = resultados[0].components
          setData(comunidad.state)
          const buscar = resultados[0].components.state
          const coincidencia = estadios.filter((element) => element.Comunidad === buscar)
          setData(coincidencia)
        }
      } catch (error) {
        console.error(error);
      }

    });




    return () => {

      olMap.setTarget(null);
    };

  }, []);

  return (

    <div>
      <div id="map" className='mapa'>
        <div className='divIcono'>
          <h1 className='titulo'>YourStadiums</h1>
          <p>Busca tu estadio más cercano</p>
          <img src={estadio} alt="logo de un estadio" />
        </div>

        <div>

          {data ? data.map((element) => (

            <div key={element.estadio} className='divTabla'>
              <table class="tabla">

                <tr>
                  <th>Comunidad Autónoma</th>
                  <th>Ciudad</th>
                  <th>Estadio</th>
                  <th>Capacidad</th>
                </tr>

                <tr>
                  <td>{element.Comunidad}</td>
                  <td>{element.ciudad}</td>
                  <td> {element.estadio}</td>
                  <td> {element.capacidad}</td>
                </tr>

              </table>

            </div>


          )) : ""}

        </div>

      </div>

    </div>
  );
}





