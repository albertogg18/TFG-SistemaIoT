import React, { useState, useMemo } from "react"
import { Lectura } from "../model/Lecturas"
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableSortLabel,
  TablePagination
} from "@mui/material"

import styles from './TablaLecturaStyle.module.css'

type Order = 'asc' | 'desc'
type OrderBy = 'timestamp' | 'temperatura' | 'humedad_aire' | 'humedad_suelo' | 'luminosidad' | 'evento_riego' | 'origen_riego'

export const TablaLecturas = ({
  lecturas
}: {
  lecturas: Lectura[]
}) => {
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<OrderBy>('timestamp')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const extraerValorParaOrdenar = (lectura: Lectura, propiedad: OrderBy) => {
    switch (propiedad) {
      case 'temperatura': return lectura.sensores.temperatura
      case 'humedad_aire': return lectura.sensores.humedad_aire
      case 'humedad_suelo': return lectura.sensores.humedad_suelo
      case 'luminosidad': return lectura.sensores.luminosidad
      case 'timestamp': return new Date(lectura.timestamp).getTime()
      case 'evento_riego': return lectura.evento_riego ? 0 : 1
      case 'origen_riego': return lectura.origen_riego || ''
    }
  }

  const lecturasOrdenadas = useMemo(() => {
    const arrayCopia = [...lecturas]
    return arrayCopia.sort((a, b) => {
      const valorA = extraerValorParaOrdenar(a, orderBy)
      const valorB = extraerValorParaOrdenar(b, orderBy)
      if (valorB < valorA) return order === 'asc' ? 1 : -1
      if (valorB > valorA) return order === 'asc' ? -1 : 1
      return 0
    })
  }, [lecturas, order, orderBy])

  const registrosVisibles = useMemo(() => {
    return lecturasOrdenadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [lecturasOrdenadas, page, rowsPerPage])

  const manejarPeticionOrden = (propiedad: OrderBy) => {
    const esAscendente = orderBy === propiedad && order === 'asc'
    setOrder(esAscendente ? 'desc' : 'asc')
    setOrderBy(propiedad)
  }

  const handleChangePage = (event: any, newPage: number) => setPage(newPage)

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const cabeceras: { id: OrderBy, label: string }[] = [
    { id: 'timestamp', label: 'Fecha y hora' },
    { id: 'temperatura', label: 'Temperatura (°C)' },
    { id: 'humedad_aire', label: 'Hum. Aire (%)' },
    { id: 'humedad_suelo', label: 'Hum. Suelo (%)' },
    { id: 'luminosidad', label: 'Luz (lux)' },
    { id: 'evento_riego', label: 'Evento de Riego' },
    { id: 'origen_riego', label: 'Origen' },
  ]

  return (
    <Paper elevation={0} className={styles['tabla-paper-root']}>
      <TableContainer className={styles['max-h-[600px]']}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {cabeceras.map((headCell) => (
                <TableCell key={headCell.id} className={styles['tabla-header-cell']}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => manejarPeticionOrden(headCell.id)}
                  >
                    <strong className={styles['tabla-header-text']}>{headCell.label}</strong>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {registrosVisibles.map((lectura) => (
              <TableRow key={lectura.id} className={styles['tabla-fila-body']}>
                <TableCell className={styles['tabla-celda-fecha']}>
                  {new Date(lectura.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className={styles['tabla-celda-dato']}>{lectura.sensores.temperatura}</TableCell>
                <TableCell className={styles['tabla-celda-dato']}>{lectura.sensores.humedad_aire}</TableCell>
                <TableCell className={styles['tabla-celda-dato']}>{lectura.sensores.humedad_suelo}</TableCell>
                <TableCell className={styles['tabla-celda-dato']}>{lectura.sensores.luminosidad}</TableCell>
                <TableCell>
                  <span className={`${styles['badge-base']} ${lectura.evento_riego ? styles['badge-regado'] : styles['badge-no-regado']}`}>
                    {lectura.evento_riego ? 'Regado' : 'No regado'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={styles['origen-tag']}>
                    {lectura.origen_riego || '-'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={lecturas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        className="paginacion-root"
      />
    </Paper>
  )
}