import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { formatDate, formatDateShort } from '../helpers/date-formatter';
import { toUpperCase } from '../helpers/text-formatter';
import { Genero } from '@prisma/client';

interface CertificacionPdaData {
  codigo: string;
  disciplina: string;
  categoria: string;
  genero: Genero;
  nombre: string;
  lugar: string;
  ciudad: string;
  provincia: string;
  pais: string;
  fechaInicio: Date;
  fechaFin: Date;
  numAtletasHombres: number;
  numAtletasMujeres: number;
  numEntrenadoresHombres: number;
  numEntrenadoresMujeres: number;
}

export const certificacionPdaReport = (
  data: CertificacionPdaData,
): TDocumentDefinitions => {
  const totalDeportistas = data.numAtletasHombres + data.numAtletasMujeres;

  return {
    pageSize: 'A4',
    pageMargins: [40, 140, 40, 80],

    header: buildPdaHeader(),

    footer: buildPdaFooter(),

    content: [
      {
        text: `FDPL-METODÓLOGO PDA – 088 – 2024\n${formatDate(new Date())}`,
        alignment: 'right',
        fontSize: 9,
        margin: [0, 0, 0, 10],
      },

      {
        text: 'CERTIFICACIÓN EVENTOS PDA 2024',
        style: 'title',
        alignment: 'center',
        margin: [0, 0, 0, 15],
      },

      {
        text: [
          `De acuerdo al aval Técnico de Participación Competitiva ${data.codigo}, de la disciplina de `,
          { text: toUpperCase(data.disciplina), bold: true },
          ' Olímpica de mi provincia, suscrito por el Lic. ',
          { text: 'Michel Rodríguez', bold: true },
          ' Entrenador la disciplina de ',
          { text: toUpperCase(data.disciplina), bold: true },
          ' Olímpica, me permito certificar que el evento ',
          { text: toUpperCase(data.nombre), bold: true },
          ' consta en el Plan Anual de Actividades aprobado por el Ministerio del Deporte pero está ',
          { text: 'bajo aprobación', bold: true },
          ' debido a que a este evento se espera enviar en la reforma del mes de julio, la cual se solicita la creación de este evento, cuyos valores serán los siguientes:',
        ],
        style: 'paragraph',
        alignment: 'justify',
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          widths: ['25%', '75%'],
          body: [
            [
              { text: 'DISCIPLINA', style: 'tableLabel' },
              { text: toUpperCase(data.disciplina), style: 'tableValue' },
            ],
            [
              { text: 'EVENTO', style: 'tableLabel' },
              { text: toUpperCase(data.nombre), style: 'tableValue' },
            ],
            [
              { text: 'NRO. PARTICIPANTES', style: 'tableLabel' },
              {
                columns: [
                  {
                    text: 'ENTRENADOR',
                    style: 'tableSubLabel',
                    width: '50%',
                  },
                  {
                    text: 'DEPORTISTAS',
                    style: 'tableSubLabel',
                    width: '50%',
                  },
                ],
              },
            ],
            [
              { text: '', border: [true, false, true, true] },
              {
                text: totalDeportistas.toString(),
                style: 'tableValue',
                alignment: 'right',
              },
            ],
            [
              { text: 'CATEGORÍA', style: 'tableLabel' },
              {
                text: toUpperCase(data.categoria),
                style: 'tableValue',
              },
            ],
            [
              { text: 'LUGAR DE COMPETENCIA', style: 'tableLabel' },
              { text: toUpperCase(data.lugar), style: 'tableValue' },
            ],
            [
              { text: 'FECHA DE SALIDA', style: 'tableLabel' },
              {
                text: `DEL ${formatDateShort(data.fechaInicio).toUpperCase()} AL ${formatDateShort(data.fechaFin).toUpperCase()}`,
                style: 'tableValue',
              },
            ],
            [
              { text: 'RESPONSABLE ANTICIPO', style: 'tableLabel' },
              { text: 'LIC. Michel Rodríguez', style: 'tableValue' },
            ],
            [
              { text: 'C. I. RESPON. ANTICIPO', style: 'tableLabel' },
              { text: '0151441326', style: 'tableValue' },
            ],
            [
              { text: 'ACTIVIDADES POA 2024', style: 'tableLabel' },
              { text: '005', style: 'tableValue' },
            ],
            [
              {
                text: 'AVAL TÉCNICO DE\nPARTICIPACIÓN COMPETITIVA',
                style: 'tableLabel',
              },
              { text: data.codigo, style: 'tableValue', bold: true },
            ],
            [
              { text: 'FONDOS', style: 'tableLabel' },
              { text: 'PÚBLICOS', style: 'tableValue', bold: true },
            ],
          ],
        },
        layout: {
          hLineWidth: (i, node) => 1,
          vLineWidth: (i) => 1,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000',
        },
        margin: [0, 0, 0, 15],
      },

      {
        text: 'Por un valor de USD$ 1252,00 dólares de acuerdo al siguiente detalle:',
        fontSize: 10,
        margin: [0, 0, 0, 5],
      },
      {
        table: {
          widths: ['10%', '25%', '15%', '35%', '15%'],
          body: [
            [
              { text: 'Nº', style: 'budgetHeader' },
              { text: 'Nombre de\nla actividad', style: 'budgetHeader' },
              { text: 'ÍTEM\npresupuestario', style: 'budgetHeader' },
              {
                text: 'Nombre del ÍTEM\npresupuestario',
                style: 'budgetHeader',
              },
              { text: 'valor', style: 'budgetHeader' },
            ],
            [
              { text: '005', style: 'budgetCell', rowSpan: 3 },
              {
                text: 'EVENTOS DE\nPREPARACIÓN\nY\nCOMPETENCIA',
                style: 'budgetCell',
                rowSpan: 3,
              },
              { text: '530235', style: 'budgetCell' },
              { text: 'Servicio de Alimentación', style: 'budgetCell' },
              { text: '576,00', style: 'budgetCell', alignment: 'right' },
            ],
            [
              {},
              {},
              { text: '530303', style: 'budgetCell' },
              {
                text: 'Gastos de viaje en el interior\n(En e-SIGEF: Viáticos en el\ninterior)',
                style: 'budgetCell',
              },
              { text: '540,00', style: 'budgetCell', alignment: 'right' },
            ],
            [
              {},
              {},
              { text: '530301', style: 'budgetCell' },
              { text: 'Pasajes al Interior', style: 'budgetCell' },
              { text: '136,00', style: 'budgetCell', alignment: 'right' },
            ],
            [
              { text: '', colSpan: 4, border: [true, true, false, true] },
              {},
              {},
              {},
              {
                text: 'TOTAL',
                style: 'budgetTotal',
                alignment: 'left',
              },
            ],
            [
              { text: '', colSpan: 4, border: [true, false, false, true] },
              {},
              {},
              {},
              {
                text: '1252,00',
                style: 'budgetTotal',
                alignment: 'right',
              },
            ],
          ],
        },
        layout: {
          hLineWidth: (i, node) =>
            i === 0 || i === node.table.body.length ? 2 : 1,
          vLineWidth: (i) => 1,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000',
          fillColor: (i) => (i === 0 ? '#E8E8E8' : null),
        },
        margin: [0, 0, 0, 10],
      },

      {
        text: 'Particular que informo para los fines legales pertinentes.',
        fontSize: 10,
        margin: [0, 10, 0, 5],
      },
      {
        text: 'Atentamente.',
        fontSize: 10,
        margin: [0, 0, 0, 30],
      },

      // Firma
      {
        text: 'Gerente Paul Ordóñez Castillo',
        fontSize: 10,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 2],
      },
      {
        text: 'METODÓLOGO ENCARGADO DEL PDA 2024',
        fontSize: 9,
        bold: true,
        alignment: 'center',
      },
    ],

    styles: {
      title: {
        fontSize: 12,
        bold: true,
      },
      paragraph: {
        fontSize: 10,
        lineHeight: 1.3,
      },
      tableLabel: {
        fontSize: 8,
        bold: true,
        fillColor: '#E8E8E8',
        margin: [3, 3, 3, 3],
      },
      tableSubLabel: {
        fontSize: 7,
        bold: true,
        alignment: 'center',
      },
      tableValue: {
        fontSize: 8,
        margin: [3, 3, 3, 3],
      },
      budgetHeader: {
        fontSize: 8,
        bold: true,
        alignment: 'center',
        margin: [3, 3, 3, 3],
      },
      budgetCell: {
        fontSize: 8,
        margin: [2, 2, 2, 2],
      },
      budgetTotal: {
        fontSize: 9,
        bold: true,
        margin: [3, 3, 3, 3],
      },
    },

    defaultStyle: {
      font: 'Roboto',
    },
  } as any;
};

function buildPdaHeader() {
  return {
    margin: [40, 20, 40, 10],
    columns: [
      {
        width: '*',
        stack: [
          {
            text: 'FEDERACIÓN DEPORTIVA',
            fontSize: 12,
            bold: true,
            color: '#FFFFFF',
          },
          {
            text: 'PROVINCIAL DE LOJA',
            fontSize: 12,
            bold: true,
            color: '#FFFFFF',
          },
          {
            text: 'FUNDADA EL 6 DE ENERO DE 1940',
            fontSize: 7,
            color: '#FFFFFF',
          },
        ],
        fillColor: '#8B4789',
        margin: [0, 5, 0, 5],
      },
      {
        width: 'auto',
        stack: [
          {
            text: 'DEPARTAMENTO',
            fontSize: 11,
            bold: true,
            color: '#FFFFFF',
            alignment: 'right',
          },
          {
            text: 'TÉCNICO - PDA',
            fontSize: 11,
            bold: true,
            color: '#FFFFFF',
            alignment: 'right',
          },
        ],
        fillColor: '#8B4789',
        margin: [10, 5, 0, 5],
      },
    ],
  } as any;
}

function buildPdaFooter() {
  return {
    margin: [40, 10, 40, 20],
    columns: [
      {
        width: 60,
        stack: [
          {
            text: '📞',
            fontSize: 12,
            margin: [0, 0, 5, 0],
          },
        ],
      },
      {
        width: '*',
        stack: [
          {
            text: '072 581 091 - 099 981 9109',
            fontSize: 8,
            color: '#FFFFFF',
          },
          {
            text: 'www.fedeloja.com - federacionloja@yahoo.es',
            fontSize: 8,
            color: '#FFFFFF',
          },
          {
            text: 'Calle Macará entre Mercadillo y Azuay (Estadio Reina del Cisne)',
            fontSize: 7,
            color: '#FFFFFF',
          },
        ],
      },
      {
        width: 'auto',
        stack: [
          {
            text: 'Fedelojaec',
            fontSize: 10,
            bold: true,
            color: '#FFFFFF',
            alignment: 'right',
          },
        ],
      },
    ],
    fillColor: '#8B4789',
  } as any;
}
