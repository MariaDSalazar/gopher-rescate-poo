// Generado por _fuente/construir.py: salidas y errores reales de go1.27.0. No editar a mano.
window.JUEGO = {
 "niveles": [
  {
   "titulo": "Arrays",
   "clave": "[N]T · índices · len",
   "icono": "rayo",
   "caso": "Cortes de luz",
   "intro": "Un array es una fila de casillas de tamaño fijo. Cada casilla tiene un índice que empieza en 0: el lunes es la casilla 0 y el domingo, la 6.",
   "contexto": "La empresa eléctrica anunció cortes de luz para toda la semana. Tu programa guarda las horas sin luz de cada día en un array: la semana siempre tiene 7 días, así que su tamaño no cambia.",
   "estructura": {
    "tipo": "array",
    "nombre": "cortes",
    "go": "[7]int",
    "valores": [
     4,
     6,
     8,
     9,
     10,
     6,
     0
    ],
    "etiquetas": [
     "Lun",
     "Mar",
     "Mié",
     "Jue",
     "Vie",
     "Sáb",
     "Dom"
    ],
    "unidad": "horas sin luz"
   },
   "base": "cortes := [7]int{4, 6, 8, 9, 10, 6, 0}",
   "retos": [
    {
     "tipo": "casilla",
     "pregunta": "Una vecina quiere saber cuántas horas estará sin luz el jueves. Toca la casilla que lee cortes[3].",
     "codigo": "fmt.Println(cortes[3])",
     "correctas": [
      3
     ],
     "pista": "El índice empieza en 0: lunes es 0, martes 1, miércoles 2 y jueves 3.",
     "explica": "cortes[3] es la cuarta casilla, la del jueves: 9 horas. Se cuenta desde 0 porque el índice dice cuántas casillas hay que avanzar desde el inicio.",
     "sticker": 1,
     "salida": "9"
    },
    {
     "tipo": "opcion",
     "pregunta": "Antes de llenar el horario de la próxima semana, el programa crea un array vacío. ¿Qué imprime?",
     "propia": true,
     "codigo": "var proxima [7]int\nfmt.Println(proxima)",
     "opciones": [
      "[0 0 0 0 0 0 0]",
      "[]",
      "nil",
      "No compila: faltan los valores"
     ],
     "correcta": 0,
     "porque": [
      "",
      "[] sería un slice vacío. El array siempre tiene sus 7 casillas.",
      "nil es el valor cero de los slices y los maps, no el de un array de enteros.",
      "Sí compila: en Go toda variable nace con el valor cero de su tipo."
     ],
     "explica": "Un array declarado sin valores nace con sus 7 casillas en 0, que es el valor cero de int. Nunca trae «basura» de la memoria.",
     "salida": "[0 0 0 0 0 0 0]"
    },
    {
     "tipo": "casilla",
     "pregunta": "El aviso del fin de semana necesita el último día. Toca la casilla que lee cortes[len(cortes)-1].",
     "codigo": "fmt.Println(cortes[len(cortes)-1])",
     "correctas": [
      6
     ],
     "pista": "len(cortes) es 7, así que el último índice es 7 − 1 = 6: el domingo.",
     "explica": "len devuelve 7 casillas y el último índice siempre es len − 1, o sea 6. El domingo no hay cortes: 0 horas.",
     "sticker": 1,
     "salida": "0"
    },
    {
     "tipo": "error",
     "pregunta": "Alguien quiso agregar un octavo día al horario. Toca la línea que no compila.",
     "lineas": [
      "total := len(cortes)",
      "cortes[7] = 5",
      "fmt.Println(total, cortes)"
     ],
     "mala": 1,
     "corregida": "total := len(cortes)\ncortes[6] = 5\nfmt.Println(total, cortes)",
     "explica": "El array tiene 7 casillas, de la 0 a la 6, y no crece. Con un índice fijo fuera de rango Go ni siquiera compila. Para una lista que crece se usa un slice (misión 3).",
     "sticker": 6,
     "fase": "compilar",
     "mensaje": "invalid argument: index 7 out of bounds [0:7]",
     "salida": "7 [4 6 8 9 10 6 5]"
    }
   ]
  },
  {
   "titulo": "Recorrer y calcular",
   "clave": "for range · contador · promedio",
   "icono": "aire",
   "caso": "Calidad del aire",
   "intro": "Con for…range recorres el array casilla por casilla. Así se cuenta, se suma, se promedia y se busca el mayor o el menor.",
   "contexto": "Una estación de monitoreo mide cada hora las partículas finas (PM2.5) del aire de la ciudad, en µg/m³. Si una lectura pasa de 50, el aire es dañino y el programa emite una alerta.",
   "estructura": {
    "tipo": "array",
    "nombre": "pm25",
    "go": "[6]int",
    "valores": [
     38,
     62,
     75,
     50,
     30,
     54
    ],
    "etiquetas": [
     "6:00",
     "7:00",
     "8:00",
     "9:00",
     "10:00",
     "11:00"
    ],
    "unidad": "µg/m³"
   },
   "base": "pm25 := [6]int{38, 62, 75, 50, 30, 54}",
   "retos": [
    {
     "tipo": "opcion",
     "pregunta": "¿Cuántas alertas emite el programa?",
     "codigo": "alertas := 0\nfor _, v := range pm25 {\n\tif v > 50 {\n\t\talertas++\n\t}\n}\nfmt.Println(alertas)",
     "opciones": [
      "3",
      "4",
      "6",
      "2"
     ],
     "correcta": 0,
     "porque": [
      "",
      "La lectura de 50 no pasa de 50: v > 50 la deja fuera.",
      "6 son todas las lecturas; el contador solo sube cuando se cumple el if.",
      "Revisa otra vez: 62, 75 y 54 pasan de 50."
     ],
     "explica": "Es el patrón contador: alertas sube solo cuando una lectura pasa de 50. Pasan 62, 75 y 54: 3 alertas.",
     "salida": "3"
    },
    {
     "tipo": "opcion",
     "pregunta": "El reporte muestra el promedio de la mañana. ¿Qué imprime?",
     "codigo": "suma := 0\nfor _, v := range pm25 {\n\tsuma += v\n}\nfmt.Println(suma / len(pm25))",
     "opciones": [
      "51",
      "51.5",
      "52",
      "309"
     ],
     "correcta": 0,
     "porque": [
      "",
      "Para ver 51.5 hacen falta float64 y float64(len(pm25)). Entre enteros, Go descarta los decimales.",
      "Go no redondea al dividir enteros: corta los decimales.",
      "309 es la suma; falta dividirla para len(pm25)."
     ],
     "explica": "La suma da 309 y se divide para 6 lecturas. Entre enteros, 309 / 6 da 51: los decimales se descartan, no se redondean.",
     "sticker": 3,
     "salida": "51"
    },
    {
     "tipo": "opcion",
     "pregunta": "Ahora se busca la hora con el aire más limpio, es decir, la lectura menor. ¿Qué imprime?",
     "codigo": "menor := 0\nfor _, v := range pm25 {\n\tif v < menor {\n\t\tmenor = v\n\t}\n}\nfmt.Println(menor)",
     "opciones": [
      "30",
      "0",
      "38",
      "54"
     ],
     "correcta": 1,
     "porque": [
      "Ese es el menor de verdad, pero el código no lo encuentra: ninguna lectura es menor que 0, así que menor nunca cambia.",
      "",
      "38 es la primera lectura, pero el código arranca en 0, no en la primera casilla.",
      "54 es la última lectura, y el código nunca cambia menor."
     ],
     "explica": "Error clásico: menor arranca en 0, ninguna lectura es menor que 0 y se queda en 0. El menor y el mayor deben arrancar en la primera casilla, menor := pm25[0], y así el resultado sería 30.",
     "sticker": 3,
     "salida": "0"
    },
    {
     "tipo": "opcion",
     "pregunta": "Se hace una copia para probar una corrección sin tocar las lecturas originales. ¿Qué imprime?",
     "codigo": "copia := pm25\ncopia[2] = 0\nfmt.Println(pm25[2], copia[2])",
     "opciones": [
      "75 0",
      "0 0",
      "75 75",
      "0 75"
     ],
     "correcta": 0,
     "porque": [
      "",
      "Eso pasaría si las dos compartieran casillas, como un slice. Un array se copia entero.",
      "copia[2] sí cambió a 0; lo que no cambia es pm25.",
      "Es al revés: la que cambió fue copia, no pm25."
     ],
     "explica": "Asignar un array copia todas sus casillas: copia es otro array. Cambiarlo no toca a pm25, así que nadie modifica las lecturas desde otra parte del programa.",
     "salida": "75 0"
    }
   ]
  },
  {
   "titulo": "Slices y append",
   "clave": "[]T · append · len y cap",
   "icono": "hospital",
   "caso": "Sala de emergencias",
   "intro": "Un slice es como un array que crece. append agrega al final y devuelve el slice nuevo, por eso siempre se escribe s = append(s, x).",
   "contexto": "En la sala de emergencias nadie sabe cuántos pacientes llegarán. La lista de espera es un slice: crece con append cada vez que alguien llega.",
   "estructura": {
    "tipo": "slice",
    "nombre": "espera",
    "go": "[]string",
    "valores": [
     "Rosa",
     "Luis"
    ]
   },
   "base": "espera := []string{\"Rosa\", \"Luis\"}",
   "retos": [
    {
     "tipo": "opcion",
     "pregunta": "Llegan dos pacientes más, Ana y Jorge. ¿Qué imprime?",
     "codigo": "espera = append(espera, \"Ana\", \"Jorge\")\nfmt.Println(len(espera), espera)",
     "opciones": [
      "4 [Rosa Luis Ana Jorge]",
      "2 [Rosa Luis]",
      "4 [Ana Jorge Rosa Luis]",
      "No compila: el slice ya tenía 2"
     ],
     "correcta": 0,
     "porque": [
      "",
      "append sí agregó a los dos, y el resultado se guardó otra vez en espera.",
      "append agrega al final, no al inicio: quien llegó primero sigue primero.",
      "Un slice crece: cuando no cabe, Go crea un array más grande y copia los datos."
     ],
     "explica": "append agrega al final y devuelve el slice con los nuevos. Como se reasigna (espera = append(…)), la lista queda con 4 pacientes en orden de llegada.",
     "despues": {
      "variable": "espera",
      "valores": [
       "Rosa",
       "Luis",
       "Ana",
       "Jorge"
      ]
     },
     "salida": "4 [Rosa Luis Ana Jorge]"
    },
    {
     "tipo": "error",
     "pregunta": "La recepción registra a Pedro, pero el programa no compila. Toca la línea con el error.",
     "lineas": [
      "fmt.Println(\"Llega Pedro\")",
      "append(espera, \"Pedro\")",
      "fmt.Println(espera)"
     ],
     "mala": 1,
     "corregida": "fmt.Println(\"Llega Pedro\")\nespera = append(espera, \"Pedro\")\nfmt.Println(espera)",
     "explica": "append no cambia la variable: devuelve el slice nuevo. Si no se guarda, el resultado se pierde, y por eso Go no compila un append sin usar. Siempre se escribe espera = append(espera, \"Pedro\").",
     "sticker": 5,
     "fase": "compilar",
     "mensaje": "append(espera, \"Pedro\") (value of type []string) is not used",
     "salida": "Llega Pedro\n[Rosa Luis Pedro]"
    },
    {
     "tipo": "opcion",
     "pregunta": "La sala tiene 5 camillas, así que el programa reserva espacio para 5 desde el inicio. ¿Qué imprime?",
     "propia": true,
     "codigo": "camillas := make([]string, 0, 5)\ncamillas = append(camillas, \"Rosa\")\nfmt.Println(len(camillas), cap(camillas))",
     "opciones": [
      "1 5",
      "6 10",
      "1 1",
      "5 5"
     ],
     "correcta": 0,
     "porque": [
      "",
      "Eso pasaría con make([]string, 5): 5 casillas ya ocupadas, más Rosa. Aquí el 0 indica que empieza sin elementos.",
      "La capacidad no baja: make ya reservó espacio para 5.",
      "len cuenta las casillas en uso, y solo hay una: Rosa."
     ],
     "explica": "make([]string, 0, 5) crea un slice con len 0 (ningún paciente) y cap 5 (espacio para 5). Después de un append queda len 1 y cap 5. Reservar espacio evita que Go copie la lista cada vez que crece.",
     "sticker": 3,
     "salida": "1 5"
    },
    {
     "tipo": "error",
     "pregunta": "Un programa antiguo de la sala usaba otra lista. Toca la línea que no compila.",
     "propia": true,
     "lineas": [
      "var fila [3]string",
      "fila = append(fila, \"Rosa\")",
      "fmt.Println(fila)"
     ],
     "mala": 1,
     "corregida": "var fila []string\nfila = append(fila, \"Rosa\")\nfmt.Println(fila)",
     "explica": "Con un número entre los corchetes, [3]string es un array, y el array no crece: append solo acepta slices. Se corrige en la declaración, sin número: var fila []string. Un slice nil ya está listo para append.",
     "sticker": 6,
     "fase": "compilar",
     "mensaje": "invalid append: argument must be a slice; have fila (variable of type [3]string)",
     "salida": "[Rosa]"
    }
   ]
  },
  {
   "titulo": "Cortar un slice",
   "clave": "[ini:fin] · comparte datos",
   "icono": "metro",
   "caso": "Tramo cerrado del metro",
   "intro": "Un corte s[ini:fin] va desde ini hasta antes de fin: el inicio entra y el fin no. Y ojo: el corte no copia, mira las mismas casillas.",
   "contexto": "Estas son seis estaciones seguidas del Metro de Quito, de sur a norte. Hoy un tramo cierra por mantenimiento y el sistema de avisos lo calcula con cortes del slice.",
   "estructura": {
    "tipo": "slice",
    "nombre": "estaciones",
    "go": "[]string",
    "valores": [
     "El Recreo",
     "La Magdalena",
     "San Francisco",
     "La Alameda",
     "El Ejido",
     "Universidad Central"
    ]
   },
   "base": "estaciones := []string{\n\t\"El Recreo\", \"La Magdalena\", \"San Francisco\",\n\t\"La Alameda\", \"El Ejido\", \"Universidad Central\",\n}",
   "retos": [
    {
     "tipo": "casilla",
     "pregunta": "El tramo que cierra hoy es estaciones[1:4]. Toca las estaciones cerradas y pulsa «Listo».",
     "codigo": "fmt.Printf(\"%q\\n\", estaciones[1:4])",
     "correctas": [
      1,
      2,
      3
     ],
     "pista": "El inicio entra y el fin no: [1:4] toma los índices 1, 2 y 3.",
     "explica": "[1:4] empieza en el índice 1 y se detiene antes del 4: La Magdalena, San Francisco y La Alameda. La cantidad es fin − inicio = 3.",
     "sticker": 4,
     "salida": "[\"La Magdalena\" \"San Francisco\" \"La Alameda\"]"
    },
    {
     "tipo": "opcion",
     "pregunta": "Mañana el cierre va desde San Francisco hasta El Ejido, las dos incluidas. ¿Qué corte lo representa?",
     "oculto": true,
     "cod": true,
     "codigo": "fmt.Printf(\"%q\\n\", estaciones[2:5])",
     "salida": "[\"San Francisco\" \"La Alameda\" \"El Ejido\"]",
     "opciones": [
      "estaciones[2:5]",
      "estaciones[2:4]",
      "estaciones[3:5]",
      "estaciones[1:4]"
     ],
     "correcta": 0,
     "porque": [
      "",
      "[2:4] se detiene antes del 4 y deja fuera El Ejido.",
      "[3:5] empieza en La Alameda y deja fuera San Francisco.",
      "[1:4] es el cierre de hoy: de La Magdalena a La Alameda."
     ],
     "explica": "San Francisco es el índice 2 y El Ejido, el 4. Como el fin no entra, hay que escribir uno más: «del 2 al 4, incluidos» se escribe [2:5].",
     "sticker": 4
    },
    {
     "tipo": "opcion",
     "pregunta": "El sistema toma el tramo de hoy y marca su primera estación. ¿Qué imprime?",
     "codigo": "tramo := estaciones[1:4]\ntramo[0] = \"CERRADA\"\nfmt.Println(estaciones[1])",
     "opciones": [
      "CERRADA",
      "La Magdalena",
      "El Recreo",
      "No compila: un corte es de solo lectura"
     ],
     "correcta": 0,
     "porque": [
      "",
      "Eso pasaría si el corte fuera una copia, pero tramo mira las mismas casillas que estaciones.",
      "tramo[0] es estaciones[1], no estaciones[0]: el corte empieza en el índice 1.",
      "Un corte se puede modificar, y el cambio llega al slice original."
     ],
     "explica": "Un corte no copia: tramo[0] y estaciones[1] son la misma casilla, por eso el cambio aparece en el original. Para trabajar en una copia aparte se usa slices.Clone(tramo).",
     "despues": {
      "variable": "estaciones",
      "valores": [
       "El Recreo",
       "CERRADA",
       "San Francisco",
       "La Alameda",
       "El Ejido",
       "Universidad Central"
      ]
     },
     "salida": "CERRADA"
    },
    {
     "tipo": "error",
     "pregunta": "Alguien escribió el tramo al revés. Toca la línea que no compila.",
     "lineas": [
      "fmt.Println(\"Tramo en mantenimiento:\")",
      "tramo := estaciones[4:2]",
      "fmt.Printf(\"%q\\n\", tramo)"
     ],
     "mala": 1,
     "corregida": "fmt.Println(\"Tramo en mantenimiento:\")\ntramo := estaciones[2:4]\nfmt.Printf(\"%q\\n\", tramo)",
     "explica": "En [ini:fin] el inicio no puede pasar al fin, y con números fijos Go lo detecta al compilar. El tramo de San Francisco a La Alameda es [2:4].",
     "sticker": 6,
     "fase": "compilar",
     "mensaje": "invalid slice indices: 2 < 4",
     "salida": "Tramo en mantenimiento:\n[\"San Francisco\" \"La Alameda\"]"
    }
   ]
  },
  {
   "titulo": "Maps",
   "clave": "map[K]V · coma ok · delete",
   "icono": "gota",
   "caso": "Banco de sangre",
   "intro": "Un map guarda pares clave → valor y busca por la clave casi al instante. Si la clave no existe devuelve el valor cero; con «coma ok» sabes si de verdad existe.",
   "contexto": "El banco de sangre del hospital lleva las unidades disponibles de cada tipo de sangre. En una emergencia se busca por el tipo, no por una posición: por eso es un map.",
   "estructura": {
    "tipo": "map",
    "nombre": "sangre",
    "go": "map[string]int",
    "valores": {
     "O+": 12,
     "A+": 7,
     "B+": 3,
     "O-": 0
    },
    "unidad": "unidades disponibles"
   },
   "base": "sangre := map[string]int{\n\t\"O+\": 12, \"A+\": 7, \"B+\": 3, \"O-\": 0,\n}",
   "retos": [
    {
     "tipo": "opcion",
     "pregunta": "Una cirugía usa 2 unidades de B+. ¿Qué imprime?",
     "codigo": "sangre[\"B+\"] -= 2\nfmt.Println(sangre[\"B+\"], len(sangre))",
     "opciones": [
      "1 4",
      "3 4",
      "1 3",
      "No compila: B+ no es un índice"
     ],
     "correcta": 0,
     "porque": [
      "",
      "sangre[\"B+\"] -= 2 sí cambia el valor guardado en esa clave: queda 1.",
      "len cuenta las claves, y siguen siendo 4: B+ no se borró, solo cambió su valor.",
      "En un map se busca por la clave, y la clave puede ser un texto como \"B+\"."
     ],
     "explica": "En un map se busca por la clave, no por la posición. sangre[\"B+\"] -= 2 deja 1 unidad, y len(sangre) sigue en 4 claves.",
     "salida": "1 4"
    },
    {
     "tipo": "opcion",
     "pregunta": "Un médico pide AB-, que nunca se registró, y O-, que se agotó. ¿Qué imprime?",
     "codigo": "u1, ok1 := sangre[\"AB-\"]\nu2, ok2 := sangre[\"O-\"]\nfmt.Println(u1, ok1, u2, ok2)",
     "opciones": [
      "0 false 0 true",
      "0 true 0 true",
      "0 false 0 false",
      "panic: la clave AB- no existe"
     ],
     "correcta": 0,
     "porque": [
      "",
      "AB- no está en el map, así que ok1 es false. El 0 que devuelve es solo el valor cero de int.",
      "O- sí existe, con 0 unidades: ok2 es true.",
      "Go no lanza un error por una clave que no existe: devuelve el valor cero."
     ],
     "explica": "Las dos búsquedas devuelven 0, pero no significan lo mismo: AB- no existe (false) y O- existe pero se agotó (true). «Coma ok» distingue «no existe» de «vale 0».",
     "sticker": 0,
     "salida": "0 false 0 true"
    },
    {
     "tipo": "error",
     "pregunta": "El registro de donaciones de hoy hace caer el programa al ejecutarlo. Toca la línea donde falla.",
     "propia": true,
     "lineas": [
      "var donaciones map[string]int",
      "donaciones[\"O+\"] = 1",
      "fmt.Println(donaciones)"
     ],
     "mala": 1,
     "corregida": "donaciones := make(map[string]int)\ndonaciones[\"O+\"] = 1\nfmt.Println(donaciones)",
     "explica": "var donaciones map[string]int crea un map nil: se puede leer, pero escribir en él provoca un panic. Primero hay que crearlo con make o con un literal.",
     "sticker": 0,
     "fase": "ejecutar",
     "mensaje": "panic: assignment to entry in nil map",
     "salida": "map[O+:1]"
    },
    {
     "tipo": "opcion",
     "pregunta": "Las unidades de O- vencieron y se quita ese tipo. También se intenta borrar AB-, que no existe. ¿Qué imprime?",
     "codigo": "delete(sangre, \"O-\")\ndelete(sangre, \"AB-\")\nfmt.Println(len(sangre), sangre)",
     "opciones": [
      "3 map[A+:7 B+:3 O+:12]",
      "4 map[A+:7 B+:3 O+:12 O-:0]",
      "2 map[A+:7 B+:3]",
      "panic: AB- no existe"
     ],
     "correcta": 0,
     "porque": [
      "",
      "delete sí quita O- del map: ya no queda ni la clave.",
      "Solo se borró O-: borrar AB-, que no existía, no quita nada más.",
      "delete no da error si la clave no existe, porque su objetivo, que no esté, ya se cumple."
     ],
     "explica": "delete quita la clave y su valor. Borrar una clave que no existe no da error. Al imprimir, fmt muestra las claves ordenadas, pero el map en sí no tiene orden.",
     "despues": {
      "variable": "sangre",
      "valores": {
       "O+": 12,
       "A+": 7,
       "B+": 3
      }
     },
     "salida": "3 map[A+:7 B+:3 O+:12]"
    }
   ]
  },
  {
   "titulo": "Misión final",
   "clave": "slice + map",
   "icono": "escudo",
   "caso": "Ataque a las contraseñas",
   "intro": "Misión final: juntas slices y maps. El slice guarda los intentos en orden y el map cuenta cuántos lleva cada IP.",
   "contexto": "Alguien intenta adivinar contraseñas en la plataforma virtual de la universidad. El servidor guarda en un slice la IP de cada inicio de sesión fallido. Si una IP falla 3 veces o más, se bloquea.",
   "estructura": {
    "tipo": "slice",
    "nombre": "fallidos",
    "go": "[]string",
    "valores": [
     "185.22.4.10",
     "201.18.9.7",
     "185.22.4.10",
     "190.5.3.2",
     "201.18.9.7",
     "185.22.4.10",
     "201.18.9.7"
    ]
   },
   "base": "fallidos := []string{\n\t\"185.22.4.10\", \"201.18.9.7\", \"185.22.4.10\",\n\t\"190.5.3.2\", \"201.18.9.7\", \"185.22.4.10\",\n\t\"201.18.9.7\",\n}",
   "retos": [
    {
     "tipo": "clasifica",
     "pregunta": "Para armar el sistema de bloqueo, ¿qué estructura usas para cada dato?",
     "opciones": [
      "Array",
      "Slice",
      "Map"
     ],
     "items": [
      [
       "Las IP de los intentos fallidos de hoy, en orden de llegada",
       "Slice",
       "La cantidad crece y el orden importa."
      ],
      [
       "Cuántos fallos lleva cada IP",
       "Map",
       "Se busca por la IP y se cuenta: clave → valor."
      ],
      [
       "Los intentos de cada día de la semana, para el reporte",
       "Array",
       "La semana siempre tiene 7 días: tamaño fijo."
      ],
      [
       "Las IP bloqueadas, para saber al instante si una ya lo está",
       "Map",
       "map[string]bool responde «¿está?» sin recorrer una lista."
      ]
     ],
     "explica": "Tamaño fijo que forma parte del significado: array. Lista que crece y cuyo orden importa: slice. Buscar por nombre, contar o evitar repetidos: map."
    },
    {
     "tipo": "opcion",
     "pregunta": "El programa cuenta los fallos de cada IP. ¿Qué imprime?",
     "codigo": "conteo := make(map[string]int)\nfor _, ip := range fallidos {\n\tconteo[ip]++\n}\nfmt.Println(conteo[\"185.22.4.10\"], conteo[\"190.5.3.2\"], len(conteo))",
     "opciones": [
      "3 1 3",
      "3 1 7",
      "1 1 3",
      "panic: la IP no existía en el map"
     ],
     "correcta": 0,
     "porque": [
      "",
      "len(conteo) cuenta las claves distintas (3 IP), no los 7 intentos.",
      "conteo[ip]++ suma cada vez que la IP aparece, y 185.22.4.10 aparece 3 veces.",
      "Una clave que no existe devuelve 0, así que conteo[ip]++ funciona desde el primer fallo."
     ],
     "explica": "La primera vez que aparece una IP, conteo[ip] vale 0 (el valor cero) y ++ lo deja en 1. Al final hay 3 IP distintas: 185.22.4.10 con 3 fallos, 201.18.9.7 con 3 y 190.5.3.2 con 1.",
     "despues": {
      "variable": "conteo",
      "valores": {
       "185.22.4.10": 3,
       "201.18.9.7": 3,
       "190.5.3.2": 1
      }
     },
     "salida": "3 1 3"
    },
    {
     "tipo": "error",
     "pregunta": "Una versión anterior del contador no compila. Toca la línea con el error.",
     "lineas": [
      "conteo := make(map[string]int)",
      "for i, ip := range fallidos {",
      "\tconteo[ip]++",
      "}",
      "fmt.Println(conteo)"
     ],
     "mala": 1,
     "corregida": "conteo := make(map[string]int)\nfor _, ip := range fallidos {\n\tconteo[ip]++\n}\nfmt.Println(conteo)",
     "explica": "range entrega dos datos: la posición i y el valor ip. Aquí i no se usa, y Go no compila variables sin usar. Se descarta con _: for _, ip := range fallidos.",
     "sticker": 2,
     "fase": "compilar",
     "mensaje": "declared and not used: i",
     "salida": "map[185.22.4.10:3 190.5.3.2:1 201.18.9.7:3]"
    },
    {
     "tipo": "opcion",
     "pregunta": "¿Qué IP quedan bloqueadas?",
     "codigo": "conteo := make(map[string]int)\nfor _, ip := range fallidos {\n\tconteo[ip]++\n}\nvar bloqueadas []string\nfor ip, n := range conteo {\n\tif n >= 3 {\n\t\tbloqueadas = append(bloqueadas, ip)\n\t}\n}\nslices.Sort(bloqueadas)\nfmt.Println(bloqueadas)",
     "opciones": [
      "[185.22.4.10 201.18.9.7]",
      "[185.22.4.10]",
      "[]",
      "[185.22.4.10 201.18.9.7 190.5.3.2]"
     ],
     "correcta": 0,
     "porque": [
      "",
      "201.18.9.7 también falló 3 veces, y n >= 3 incluye el 3.",
      "Con n > 3 no entraría ninguna; con n >= 3 entran las dos que fallaron 3 veces.",
      "190.5.3.2 falló una sola vez: no llega a 3."
     ],
     "explica": "Se recorre el map y se agrega al slice cada IP con 3 fallos o más. El orden de un map cambia en cada ejecución; por eso se ordena con slices.Sort antes de imprimir el reporte.",
     "despues": {
      "variable": "bloqueadas",
      "valores": [
       "185.22.4.10",
       "201.18.9.7"
      ]
     },
     "salida": "[185.22.4.10 201.18.9.7]"
    }
   ]
  }
 ],
 "url": "https://mariadsalazar.github.io/gopher-rescate-poo/",
 "go": "go1.27.0"
};
