import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import '../css/main.css'


export const MapStadium = () => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const claveApi = '30f3a4ca9d5a4679a03678438ffa439a'


  useEffect(() => {
    const centrarCoordenadas = [-385829.7235784164, 4885295.083634573];
    // [-102813.94393640896, 5117190.872603971]

    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    const view = new View({
      center: centrarCoordenadas,
      zoom: 7, // Nivel de zoom inicial
    });


    const olMap = new Map({
      layers: [baseLayer],
      target: 'map',
      view: view,
    });


    ////////////evento click para recoger las coordenadas del usuario al clickar
    olMap.on('click', async (e) => {
      const coordenadas = e.coordinate;
      console.log(coordenadas);
      const coordenadasConvertidas = transform(coordenadas, 'EPSG:3857', 'EPSG:4326');
      console.log(coordenadasConvertidas);

      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?key=${claveApi}&q=${coordenadasConvertidas[1]}+${coordenadasConvertidas[0]}`
        );

        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }

        const data = await response.json();
        const results = data.results;
        console.log(results);
        if (results.length > 0) {
          const comunidad = results[0].components.state
          setClickedLocation(comunidad)
          console.log(comunidad);
        }
      } catch (error) {
        console.error('Error al obtener la información de ubicación:', error);
      }
    });



    return () => {

      olMap.setTarget(null);
    };

  }, []);

  return (

    <div>
      <h1>{clickedLocation && <p>{clickedLocation}</p>}</h1>
      <div id="map" className='mapa'>

        <div>
        <p className='pInfo'>Marque la comunida que le interese</p>
        </div>


      </div>
    </div>
  );
}





