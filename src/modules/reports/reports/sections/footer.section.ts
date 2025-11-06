import { Content } from 'pdfmake/interfaces';

interface FooterOptions {
  showSocial?: boolean;
}

export const footerSection = (options: FooterOptions = {}): Content => {
  const { showSocial = true } = options;

  return {
    margin: [40, 10, 40, 20],
    columns: [
      {
        width: '*',
        stack: [
          {
            text: '072 581 091 - 099 981 9109',
            style: 'footerText',
          },
          {
            text: 'www.fedeloja.com - federacionloja@yahoo.es',
            style: 'footerText',
          },
        ],
      },
      ...(showSocial
        ? [
            {
              width: 'auto',
              text: 'Fedelojaec',
              style: 'footerSocial',
            },
          ]
        : []),
    ],
  } as any;
};
