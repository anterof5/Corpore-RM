export default function SalvarArquivo(data, titulo) {
  let dados =  data
  JSON.stringify(dados)
  const blob = new Blob(dados, {type: 'text/csv;charset=ansi'
  })
  const e = document.createEvent('MouseEvents'),
  a = document.createElement('a');
  a.download = titulo+".txt";
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/csv;charset=ansi', a.download, a.href].join(':');
  e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
}
