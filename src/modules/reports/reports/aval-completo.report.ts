import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { footerSection } from './sections/footer.section';
import { formatDate } from '../helpers/date-formatter';
import { toUpperCase } from '../helpers/text-formatter';
import { Genero } from '@prisma/client';

interface AvalCompletoData {
  codigo: string;
  disciplina: string;
  categoria: string;
  genero: Genero;
  nombre: string;
  lugar: string;
  fechaInicio: Date;
  fechaFin: Date;
  dtmUrl?: string | null;
  pdaUrl?: string | null;
  deportistas: Array<{
    nombres: string;
    apellidos: string;
    cedula: string;
    habilitado: boolean;
  }>;
  entrenadores: Array<{
    nombres: string;
    apellidos: string;
    cedula: string;
    rol?: string;
  }>;
}

export const avalCompletoReport = (
  data: AvalCompletoData,
): TDocumentDefinitions => {
  const fechaInicio = formatDate(data.fechaInicio);
  const fechaFin = formatDate(data.fechaFin);

  const deportistasBody = [
    [
      { text: 'Nombres', style: 'tableHeader' },
      { text: 'Apellidos', style: 'tableHeader' },
      { text: 'Cédula', style: 'tableHeader' },
      { text: 'Habilitado', style: 'tableHeader' },
    ],
    ...data.deportistas.map((d) => [
      { text: d.nombres, style: 'tableCell' },
      { text: d.apellidos, style: 'tableCell' },
      { text: d.cedula, style: 'tableCell' },
      { text: d.habilitado ? 'Sí' : 'No', style: 'tableCell' },
    ]),
  ];

  const entrenadoresBody = [
    [
      { text: 'Nombres', style: 'tableHeader' },
      { text: 'Apellidos', style: 'tableHeader' },
      { text: 'Cédula', style: 'tableHeader' },
      { text: 'Rol', style: 'tableHeader' },
    ],
    ...data.entrenadores.map((e) => [
      { text: e.nombres, style: 'tableCell' },
      { text: e.apellidos, style: 'tableCell' },
      { text: e.cedula, style: 'tableCell' },
      { text: e.rol ?? '', style: 'tableCell' },
    ]),
  ];

  return {
    pageSize: 'A4',
    pageMargins: [40, 100, 40, 60],

    header: headerSection({ showDepartment: true }),
    footer: footerSection({ showSocial: true }),

    content: [
      {
        text: `DOCUMENTO DE AVAL - ${data.codigo}`,
        style: 'mainTitle',
        alignment: 'center',
      },
      {
        text: 'Resumen del Evento',
        style: 'sectionTitle',
        margin: [0, 10, 0, 5],
      },
      {
        table: {
          widths: [120, '*'],
          body: [
            [
              { text: 'DEPORTE', style: 'tableHeader' },
              { text: toUpperCase(data.disciplina), style: 'tableCell' },
            ],
            [
              { text: 'CATEGORÍA', style: 'tableHeader' },
              { text: toUpperCase(data.categoria), style: 'tableCell' },
            ],
            [
              { text: 'EVENTO', style: 'tableHeader' },
              { text: toUpperCase(data.nombre), style: 'tableCell' },
            ],
            [
              { text: 'LUGAR', style: 'tableHeader' },
              { text: toUpperCase(data.lugar), style: 'tableCell' },
            ],
            [
              { text: 'FECHA', style: 'tableHeader' },
              {
                text: `${toUpperCase(fechaInicio)} - ${toUpperCase(fechaFin)}`,
                style: 'tableCell',
              },
            ],
          ],
        },
        layout: 'noBorders',
      },

      { text: '\n' },

      {
        text: 'Documentos adjuntos',
        style: 'sectionSubtitle',
        margin: [0, 5, 0, 5],
      },
      {
        ul: [
          data.pdaUrl ? `PDA: ${data.pdaUrl}` : 'PDA: (no disponible)',
          data.dtmUrl ? `DTM: ${data.dtmUrl}` : 'DTM: (no disponible)',
        ],
        style: 'listItem',
      },

      { text: '\n' },

      { text: 'Deportistas', style: 'sectionSubtitle', margin: [0, 5, 0, 5] },
      {
        table: {
          widths: ['*', '*', 100, 80],
          body: deportistasBody,
        },
        layout: 'lightHorizontalLines',
      },

      { text: '\n' },

      { text: 'Entrenadores', style: 'sectionSubtitle', margin: [0, 10, 0, 5] },
      {
        table: {
          widths: ['*', '*', 100, 80],
          body: entrenadoresBody,
        },
        layout: 'lightHorizontalLines',
      },

      { text: '\n' },

      {
        text: 'Observaciones',
        style: 'sectionSubtitle',
        margin: [0, 10, 0, 5],
      },
      { text: '', style: 'observation' },
    ],

    styles: {
      mainTitle: { fontSize: 13, bold: true },
      sectionTitle: { fontSize: 11, bold: true },
      sectionSubtitle: { fontSize: 10, bold: true },
      tableHeader: {
        fontSize: 9,
        bold: true,
        fillColor: '#E8E8E8',
        margin: [5, 5, 5, 5],
      },
      tableCell: { fontSize: 9, margin: [5, 5, 5, 5] },
      listItem: { fontSize: 9, margin: [0, 2, 0, 2] },
      observation: { fontSize: 9, margin: [0, 5, 0, 5] },
    },

    defaultStyle: { font: 'Roboto' },
  } as any;
};
