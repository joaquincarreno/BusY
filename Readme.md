# Busy

Busy es una aplicación de navegador que permite la visualización y procesamiento de registros GPS de buses.

## Instalación

### Backend

Para poder usar este proyecto es necesario tener un archivo que indique los paraderos y al menos uno de datos GPS.

Para los paraderos es necesario que las columnas sigan el mismo formato que utiliza la DTMP en sus [planes operacionales](https://www.dtpm.cl/index.php/noticias/plan-operacional-historico). Este archivo debe estar en la carpeta backend/api/data/raw.

Los datos de buses deben contener las columnas `'patente', 'recorrido', 'datetime', 'lat', 'lon'`, otras columnas serán ignoradas. Estos archivos pueden ser más de uno y deben estar dentro de la carpeta backend/api/raw/buses.

Ambos archivos deben tener una primera columna en la cual se indiquen los nombres de las columnas.

### Frontend

Es necesario fijar la ip para poder acceder a los datos del backend. Esto es cambiando la variable `BACKEND_IP` en el archivo `App.jsx` por localhost en caso de que el contenedor se ejecute en la misma máquina que se quiere acceder a la aplicación, o su ip local en caso de que se quiera acceder en red local.

## Uso

Ya que la aplicación está separada en contenedores Docker, basta con ejecutar el siguinte comando:

```shell
    docker compose up
```

El backend estará en el puerto 8000 y el frontend en el puerto 5173.