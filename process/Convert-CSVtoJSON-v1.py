# SE AGREGO CAMPO PRODUCTO_DESCRIPCION EN EL CSV Y JSON

import csv
import json
import os

# Rutas de entrada/salida
csv_file = './data/viiajo-inventario-v2.csv'
json_file = './data/viiajo-inventario-v2.json'

# Validar existencia del archivo CSV
if not os.path.exists(csv_file):
    raise FileNotFoundError(f"Archivo CSV no encontrado: {csv_file}")

productos = []

with open(csv_file, mode='r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    
    # Limpiar encabezados
    reader.fieldnames = [name.strip().lower() for name in reader.fieldnames]
    
    # Validar encabezados requeridos
    requeridos = ['id', 'titulo', 'imagen', 'categoria_id', 'categoria_nombre', 'producto_descripcion', 'precio']
    faltantes = [campo for campo in requeridos if campo not in reader.fieldnames]
    if faltantes:
        raise KeyError(f"Faltan columnas en el CSV: {faltantes}")

    for row in reader:
        try:
            producto = {
                "id": row["id"].strip(),
                "titulo": row["titulo"].strip(),
                "imagen": row["imagen"].strip(),
                "categoria": {
                    "id": row["categoria_id"].strip(),
                    "nombre": row["categoria_nombre"].strip()
                },
                "descripcion": row["producto_descripcion"].strip(),
                "precio": float(row["precio"].strip())
            }
            productos.append(producto)
        except Exception as e:
            print(f"Error procesando fila: {row}\n{e}")

# Guardar como JSON
with open(json_file, mode='w', encoding='utf-8') as f:
    json.dump(productos, f, indent=4, ensure_ascii=False)

print(f"Conversión completada. Se generaron {len(productos)} productos.")