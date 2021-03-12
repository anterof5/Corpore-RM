
export default function SalvarXML(data, titulo) {

  var agora = new Date()

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear().toString() //.substr(-2)

    if (month.length < 2)
      month = '0' + month
    if (day.length < 2)
      day = '0' + day
    //return [year,month,day+"T00:00:00"  ].join('-')
    return [year,month,day+"T00:00:00"  ].join('-')
  }
  var strdata = formatDate(agora)
  var doc = document.implementation.createDocument("", "", null);
  var FinLAN = doc.createElement("FinLAN");
  // Cria o documento e o elemento FLAN.
  doc.appendChild(FinLAN);
  for (var i = 0; i < data.length; i++) {
    // FLAN
    var FLAN = doc.createElement("FLAN");
    FinLAN.appendChild(FLAN);
    // CODCOLIGADA
    var CODCOLIGADA = doc.createElement("CODCOLIGADA");
    CODCOLIGADA.textContent = data[i]['CODCOLIGADA']
    FLAN.appendChild(CODCOLIGADA)
    // IDLAN
    var IDLAN = doc.createElement("IDLAN");
    IDLAN.textContent = "-"+ (i+1)
    FLAN.appendChild(IDLAN)
    // NUMERODOCUMENTO
    var NUMERODOCUMENTO = doc.createElement('NUMERODOCUMENTO')
    NUMERODOCUMENTO.textContent = data[i]['NUMERODOCUMENTO']
    FLAN.appendChild(NUMERODOCUMENTO)
    // NFOUDUP
    var NFOUDUP = doc.createElement('NFOUDUP')
    NFOUDUP.textContent = 0
    FLAN.appendChild(NFOUDUP)
    // CLASSIFICACAO
    var CLASSIFICACAO = doc.createElement('CLASSIFICACAO')
    CLASSIFICACAO.textContent = 0
    FLAN.appendChild(CLASSIFICACAO)
    // PAGREC
    var PAGREC = doc.createElement('PAGREC')
    PAGREC.textContent = 1
    FLAN.appendChild(PAGREC)
    // STATUSLAN
    var STATUSLAN = doc.createElement('STATUSLAN')
    STATUSLAN.textContent = 0
    FLAN.appendChild(STATUSLAN)
    // CODAPLICACAO
    var CODAPLICACAO = doc.createElement('CODAPLICACAO')
    CODAPLICACAO.textContent = 'F'
    FLAN.appendChild(CODAPLICACAO)
    // // CODCCUSTO
    // var CODCCUSTO = doc.createElement('CODCCUSTO')
    // CODCCUSTO.textContent = data[i]['CODCCUSTO']
    // FLAN.appendChild(CODCCUSTO)
    // DATACRIACAO
    var DATACRIACAO = doc.createElement('DATACRIACAO')
    DATACRIACAO.textContent = data[i]['DATACRIACAO'] //.replace('/', '-').replace('/', '-')+"T00:00:00"
    FLAN.appendChild(DATACRIACAO)
    // DATAVENCIMENTO
    var DATAVENCIMENTO = doc.createElement('DATAVENCIMENTO')
    DATAVENCIMENTO.textContent = data[i]['DATAVENCIMENTO'] //.replace('/', '-').replace('/', '-')+"T00:00:00"
    FLAN.appendChild(DATAVENCIMENTO)
    // DATAEMISSAO
    var DATAEMISSAO = doc.createElement('DATAEMISSAO')
    DATAEMISSAO.textContent = strdata
    FLAN.appendChild(DATAEMISSAO)

    //Não será utilizada, a multa está em aberto.
    // DATABAIXA
    //var DATABAIXA = doc.createElement('DATABAIXA')
    //DATABAIXA.textContent = strdata
    //FLAN.appendChild(DATABAIXA)
    // DATAPAG
    //var DATAPAG = doc.createElement('DATAPAG')
    //DATAPAG.textContent = strdata
    //FLAN.appendChild(DATAPAG)

    // VALORORIGINAL
    var VALORORIGINAL = doc.createElement('VALORORIGINAL')
    VALORORIGINAL.textContent = data[i]['VALORORIGINAL']
    FLAN.appendChild(VALORORIGINAL)
    // VALORBAIXADO
    var VALORBAIXADO = doc.createElement('VALORBAIXADO')
    VALORBAIXADO.textContent = 0
    FLAN.appendChild(VALORBAIXADO)
    // CODCOLCFO
    var CODCOLCFO = doc.createElement('CODCOLCFO')
    CODCOLCFO.textContent = data[i]['CODCOLCFO']
    FLAN.appendChild(CODCOLCFO)
    // CODCFO
    var CODCFO = doc.createElement('CODCFO')
    CODCFO.textContent = data[i]['CODCFO']
    FLAN.appendChild(CODCFO)
    // CODCOLCXA
    var CODCOLCXA = doc.createElement('CODCOLCXA')
    CODCOLCXA.textContent = data[i]['CODCOLCXA']
    FLAN.appendChild(CODCOLCXA)
    // CODCXA
    var CODCXA = doc.createElement('CODCXA')
    CODCXA.textContent = data[i]['CODCXA']
    FLAN.appendChild(CODCXA)
    // CODTDO
    var CODTDO = doc.createElement('CODTDO')
    CODTDO.textContent = data[i]['CODTDO']
    FLAN.appendChild(CODTDO)
    // CODFILIAL
    var CODFILIAL = doc.createElement('CODFILIAL')
    CODFILIAL.textContent = data[i]['CODFILIAL']
    FLAN.appendChild(CODFILIAL)
    // CODDEPARTAMENTO
    var CODDEPARTAMENTO = doc.createElement('CODDEPARTAMENTO')
    CODDEPARTAMENTO.textContent = data[i]['CODDEPARTAMENTO']
    FLAN.appendChild(CODDEPARTAMENTO)
    // SERIEDOCUMENTO
    var SERIEDOCUMENTO = doc.createElement('SERIEDOCUMENTO')
    SERIEDOCUMENTO.textContent = '@@@'
    FLAN.appendChild(SERIEDOCUMENTO)
    // CODTB1FLX
    var CODTB1FLX = doc.createElement('CODTB1FLX')
    CODTB1FLX.textContent = data[i]['CODTB1FLX']
    FLAN.appendChild(CODTB1FLX)
    // TIPOCONTABILLAN
    var TIPOCONTABILLAN = doc.createElement('TIPOCONTABILLAN')
    TIPOCONTABILLAN.textContent = data[i]['TIPOCONTABILLAN']
    FLAN.appendChild(TIPOCONTABILLAN)
    var BAIXAAUTORIZADA = doc.createElement('BAIXAAUTORIZADA')
    BAIXAAUTORIZADA.textContent = '1'
    FLAN.appendChild(BAIXAAUTORIZADA)
    // CODMOEVALORORIGINAL
    var CODMOEVALORORIGINAL = doc.createElement('CODMOEVALORORIGINAL')
    CODMOEVALORORIGINAL.textContent = 'R$'
    FLAN.appendChild(CODMOEVALORORIGINAL)
    // // IDFORMAPAGTO
    // var IDFORMAPAGTO = doc.createElement('IDFORMAPAGTO')
    // IDFORMAPAGTO.textContent = 1
    // FLAN.appendChild(IDFORMAPAGTO)
    // INSSEMOUTRAEMPRESA
    var INSSEMOUTRAEMPRESA = doc.createElement('INSSEMOUTRAEMPRESA')
    INSSEMOUTRAEMPRESA.textContent = "0.0000"
    FLAN.appendChild(INSSEMOUTRAEMPRESA)
    // PERCENTBASEINSS
    var PERCENTBASEINSS = doc.createElement('PERCENTBASEINSS')
    PERCENTBASEINSS.textContent = "0.0000"
    FLAN.appendChild(PERCENTBASEINSS)
    // REUTILIZACAO
    var REUTILIZACAO = doc.createElement('REUTILIZACAO')
    REUTILIZACAO.textContent = 0
    FLAN.appendChild(REUTILIZACAO)
    // HISTORICO
    var HISTORICO = doc.createElement('HISTORICO')
    HISTORICO.textContent = data[i]['HISTORICO']
    FLAN.appendChild(HISTORICO)
  }

   var saveData = (function () {
       var a = document.createElement("a");
       document.body.appendChild(a);
       a.style = "display: none";
       return function (data, titulo) {
         var s = new XMLSerializer();
         var prologo = '<?xml version="1.0" standalone="yes"?>';
         var xml =  prologo + (s.serializeToString(doc)), //.replace('<?xml version="1.0"?>','<?xml version="1.0" standalone="yes"?>'),
        //var json = JSON.stringify(doc),
               blob = new Blob([xml], {type: "text/xml"}),
               url = window.URL.createObjectURL(blob);
           a.href = url;
           a.download = titulo;
           a.click();
           window.URL.revokeObjectURL(url);
       };
   }());

   saveData(doc, titulo);


}
