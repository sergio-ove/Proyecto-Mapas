import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export const MapStadium = () => {


  useEffect(() => {
    const centrarCoordenadas = [-385829.7235784164, 4885295.083634573];

    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    const view = new View({
      center: centrarCoordenadas,
      zoom: 7, // Nivel de zoom inicial
    });


    const map = new Map({
      layers: [baseLayer],
      target: 'map', 
      view: view,
    });

  
    return () => {
   
      map.setTarget(null);
    };

  }, []);

  return (

    <div id="map" className='mapa'>

    </div>
  );
}





