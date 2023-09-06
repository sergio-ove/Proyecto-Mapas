import React, { useState } from 'react';
import { transform } from 'ol/proj';

function MapComponent() {
    const [clickedLocation, setClickedLocation] = useState(null);
    const claveApi = '30f3a4ca9d5a4679a03678438ffa439a'
    

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
                const comunidad = results
                const objetivo = comunidad[0].components.state;
                setClickedLocation(objetivo)
            }
        } catch (error) {
            console.error('Error al obtener la información de ubicación:', error);
        }
    });


    return (
        <div>
            {clickedLocation && <p>Comunidad Autónoma: {clickedLocation}</p>}
        </div>
    );
}

export default MapComponent;

