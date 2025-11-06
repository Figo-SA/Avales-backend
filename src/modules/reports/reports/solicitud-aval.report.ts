import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { footerSection } from './sections/footer.section';
import { formatDate } from '../helpers/date-formatter';
import { capitalize, toUpperCase } from '../helpers/text-formatter';
import { Genero } from '@prisma/client';

interface SolicitudAvalData {
  codigo: string;
  disciplina: string;
  categoria: string;
  genero: Genero;
  nombre: string;
  lugar: string;
  fechaInicio: Date;
  fechaFin: Date;
  numAtletasHombres: number;
  numAtletasMujeres: number;
  numEntrenadoresHombres: number;
  numEntrenadoresMujeres: number;
}

export const solicitudAvalReport = (
  data: SolicitudAvalData,
): TDocumentDefinitions => {
  const totalAtletas = data.numAtletasHombres + data.numAtletasMujeres;
  const totalEntrenadores =
    data.numEntrenadoresHombres + data.numEntrenadoresMujeres;
  const totalGeneral = totalAtletas + totalEntrenadores;

  const fechaInicio = formatDate(data.fechaInicio);
  const fechaFin = formatDate(data.fechaFin);

  return {
    pageSize: 'A4',
    pageMargins: [40, 100, 40, 60],

    header: headerSection({
      showDepartment: true,
    }),

    footer: footerSection({ showSocial: true }),

    content: [
      {
        text: `AVAL TECNICO DE PARTICIPACION COMPETITIVA  #${data.codigo}`,
        style: 'mainTitle',
        alignment: 'center',
      },
      {
        text: 'DATOS INFORMATIVOS',
        style: 'sectionTitle',
        alignment: 'center',
        margin: [0, 5, 0, 10],
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
              { text: 'CATEGORÍAS', style: 'tableHeader' },
              { text: toUpperCase(data.categoria), style: 'tableCell' },
            ],
            [
              { text: 'GÉNERO', style: 'tableHeader' },
              { text: formatGenero(data.genero), style: 'tableCell' },
            ],
            [
              { text: 'EVENTO', style: 'tableHeader' },
              { text: toUpperCase(data.nombre), style: 'tableCell' },
            ],
            [
              { text: 'LUGAR Y FECHA', style: 'tableHeader' },
              {
                text: `${toUpperCase(data.lugar)} DEL ${toUpperCase(fechaInicio)} AL ${toUpperCase(fechaFin)}`,
                style: 'tableCell',
              },
            ],
            [
              { text: 'ENTRENADOR', style: 'tableHeader' },
              { text: '________________________________', style: 'tableCell' },
            ],
            [
              { text: 'OTROS', style: 'tableHeader' },
              { text: '', style: 'tableCell' },
            ],
          ],
        },
        layout: 'noBorders',
      },

      { text: '\n' },

      // Objetivos de participación
      {
        text: 'OBJETIVOS DE PARTICIPACIÓN',
        style: 'sectionSubtitle',
        margin: [0, 0, 0, 5],
      },
      {
        ol: [
          'Conocer si nuestros deportistas son capaces de ejecutar los elementos técnicos dados hasta la fecha.',
          'Comprobar si las deficiencias detectadas en los eventos anteriores se han ido erradicando.',
          'Ver como se encuentran los diferentes componentes de la preparación.',
        ],
        style: 'listItem',
      },

      { text: '\n' },

      // Criterios de selección
      {
        text: 'CRITERIOS DE SELECCIÓN',
        style: 'sectionSubtitle',
        margin: [0, 0, 0, 5],
      },
      {
        ol: [
          'Haber tenido buen desempeño en el Campeonato Nacional de su categoría ubicándose dentro los 8 primeros puestos a nivel nacional.',
          'Estar en la pre-selección de nuestra provincia para poder participar en los futuros Juegos Nacionales.',
        ],
        style: 'listItem',
      },

      { text: '\n' },

      // Conformación de la delegación
      {
        text: 'CONFORMACIÓN DE LA DELEGACIÓN:',
        style: 'sectionSubtitle',
        margin: [0, 0, 0, 5],
      },
      {
        table: {
          widths: [60, 60, 60, 60, 80],
          body: [
            [
              { text: 'OFICIALES', style: 'miniTableHeader', colSpan: 2 },
              {},
              { text: 'ATLETAS', style: 'miniTableHeader', colSpan: 2 },
              {},
              { text: 'TOTAL', style: 'miniTableHeader' },
            ],
            [
              { text: 'D', style: 'miniTableHeader' },
              { text: 'V', style: 'miniTableHeader' },
              { text: 'D', style: 'miniTableHeader' },
              { text: 'V', style: 'miniTableHeader' },
              { text: '', style: 'miniTableCell' },
            ],
            [
              {
                text: data.numEntrenadoresHombres.toString(),
                style: 'miniTableCell',
              },
              {
                text: data.numEntrenadoresMujeres.toString(),
                style: 'miniTableCell',
              },
              {
                text: data.numAtletasHombres.toString(),
                style: 'miniTableCell',
              },
              {
                text: data.numAtletasMujeres.toString(),
                style: 'miniTableCell',
              },
              { text: totalGeneral.toString(), style: 'miniTableCell' },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000',
        },
      } as any,
      {
        text: 'Nota: Adjuntar la hoja Excel con el detalle de los atletas',
        style: 'note',
        margin: [0, 5, 0, 0],
      },

      { text: '\n' },

      {
        text: 'REQUERIMIENTOS:',
        style: 'sectionSubtitle',
        margin: [0, 0, 0, 5],
      },
      {
        table: {
          widths: [100, '*', 100, 60, 60],
          body: [
            [
              { text: 'RUBROS', style: 'reqTableHeader' },
              { text: 'Cantidad/días', style: 'reqTableHeader' },
              { text: 'RUBROS', style: 'reqTableHeader' },
              { text: 'Cantidad', style: 'reqTableHeader' },
              { text: 'Valor', style: 'reqTableHeader' },
            ],
            [
              { text: 'TRANSPORTE PROVINCIAL', style: 'reqTableCell' },
              {
                text: `${totalGeneral} pasajes deportistas y entrenadores`,
                style: 'reqTableCell',
              },
              { text: '', style: 'reqTableCell' },
              { text: '', style: 'reqTableCell' },
              { text: '', style: 'reqTableCell' },
            ],
            [
              { text: 'ALIMENTACIÓN', style: 'reqTableCell' },
              {
                text: `Alimentación por 4 días para ${totalGeneral} personas`,
                style: 'reqTableCell',
              },
              { text: '', style: 'reqTableCell' },
              { text: '', style: 'reqTableCell' },
              { text: '', style: 'reqTableCell' },
            ],
            [
              { text: 'HOSPEDAJE', style: 'reqTableCell' },
              { text: '', style: 'reqTableCell' },
              { text: '', style: 'reqTableCell' },
              { text: '', style: 'reqTableCell' },
              { text: '', style: 'reqTableCell' },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000',
        },
      } as any,

      { text: '\n' },

      {
        text: 'OBSERVACIONES:',
        style: 'sectionSubtitle',
        margin: [0, 0, 0, 5],
      },
      {
        text: 'Se solicita el apoyo económico de auto gestión de FDL para transporte de Cariamanga (Biblián) Cañar en el PDA 136 dólares el cual sería',
        style: 'observation',
      },
    ],

    styles: {
      // Estilos del header
      headerTitle: {
        fontSize: 12,
        bold: true,
        color: '#000000',
      },
      headerSubtitle: {
        fontSize: 8,
        color: '#000000',
      },
      departmentTitle: {
        fontSize: 11,
        bold: true,
        color: '#8B7500',
      },
      // Estilos del contenido
      mainTitle: {
        fontSize: 13,
        bold: true,
        color: '#000000',
      },
      sectionTitle: {
        fontSize: 11,
        bold: true,
        color: '#000000',
      },
      sectionSubtitle: {
        fontSize: 10,
        bold: true,
        color: '#000000',
      },
      tableHeader: {
        fontSize: 9,
        bold: true,
        fillColor: '#E8E8E8',
        margin: [5, 5, 5, 5],
      },
      tableCell: {
        fontSize: 9,
        margin: [5, 5, 5, 5],
      },
      miniTableHeader: {
        fontSize: 8,
        bold: true,
        alignment: 'center',
        margin: [3, 3, 3, 3],
      },
      miniTableCell: {
        fontSize: 8,
        alignment: 'center',
        margin: [3, 3, 3, 3],
      },
      reqTableHeader: {
        fontSize: 8,
        bold: true,
        alignment: 'center',
        fillColor: '#E8E8E8',
        margin: [3, 3, 3, 3],
      },
      reqTableCell: {
        fontSize: 8,
        margin: [3, 3, 3, 3],
      },
      listItem: {
        fontSize: 9,
        margin: [0, 2, 0, 2],
      },
      note: {
        fontSize: 8,
        italics: true,
      },
      observation: {
        fontSize: 9,
        margin: [0, 5, 0, 5],
      },
      // Estilos del footer
      footerText: {
        fontSize: 8,
        color: '#000000',
      },
      footerSocial: {
        fontSize: 10,
        bold: true,
        color: '#000000',
      },
    },

    defaultStyle: {
      font: 'Roboto',
    },
  } as any;
};

function formatGenero(genero: Genero): string {
  const generoMap: Record<Genero, string> = {
    MASCULINO: 'MASCULINO',
    FEMENINO: 'FEMENINO',
    MASCULINO_FEMENINO: 'MASCULINO - FEMENINO',
  };
  return generoMap[genero] || genero;
}
