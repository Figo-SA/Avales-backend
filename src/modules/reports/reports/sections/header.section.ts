import { Content } from 'pdfmake/interfaces';

interface HeaderOptions {
  title?: string;
  showDepartment?: boolean;
}

export const headerSection = (options: HeaderOptions = {}): Content => {
  const { title = 'FEDERACIÓN DEPORTIVA', showDepartment = true } = options;

  return {
    margin: [40, 20, 40, 10],
    columns: [
      {
        width: '*',
        stack: [
          {
            text: title,
            style: 'headerTitle',
          },
          {
            text: 'PROVINCIAL DE LOJA',
            style: 'headerTitle',
          },
          {
            text: 'FUNDADA E.G. 6 DE ENERO DE 1940',
            style: 'headerSubtitle',
          },
        ],
      },
      ...(showDepartment
        ? [
            {
              width: 'auto',
              stack: [
                {
                  text: 'DEPARTAMENTO TÉCNICO',
                  style: 'departmentTitle',
                  alignment: 'right',
                },
                {
                  text: 'METODOLÓGICO',
                  style: 'departmentTitle',
                  alignment: 'right',
                },
              ],
            },
          ]
        : []),
    ],
  } as any;
};
