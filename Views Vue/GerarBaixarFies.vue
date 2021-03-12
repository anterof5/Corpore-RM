<template>
  <v-container fluid>
    <v-row>
      <v-col cols="10">
        <h2 v-if="!items">
          Analisando registros, por favor aguarde...
        </h2>
        <h2 v-if="items">
          Lançamentos a serem baixados.
        </h2>
      </v-col>
      <v-col cols="2">
        <v-spacer />
        <v-btn
          rounded
          class="white--text"
          type="submit"
          color="success"
          @click="gerarBaixa()"
        >
          Gerar Baixa
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="items">
      <v-col cols="12">
        <v-progress-linear
          indeterminate
          :active="loading"
          color="yellow darken-2"
        />
        <v-data-table
          :headers="headers"
          loading-text="Carregando, por favor espere."
          no-data-text="Nenhum resultado encontrado."
          :footer-props="{
            'items-per-page-text':'Items por página'
          }"
          :items="items"
          item-key="ID"
          :items-per-page="15"
        />
      </v-col>
    </v-row>
    <v-skeleton-loader
      v-if="!items"
      type="table"
    />
  </v-container>
</template>

<script>
import axios from 'axios'
import SalvarArquivo from '@/components/Filtros/SalvarArquivo'
// var agora = new Date()
//
// function formatDate(date) {
//   var d = new Date(date),
//     month = '' + (d.getMonth() + 1),
//     day = '' + d.getDate(),
//     year = d.getFullYear().toString().substr(-2)
//
//   if (month.length < 2)
//     month = '0' + month
//   if (day.length < 2)
//     day = '0' + day
//   return [day, month, year].join('')
// }
// var strdata = formatDate(agora)

export default {
  name: 'BaixarFies',
  data() {
    return {
      host: process.env.VUE_APP_HOST,
      apikey: localStorage.apikey,
      usuario: '',
      loading: false,
      numdoc: null,
      headers: [{
          text: 'Coligada',
          value: 'CODCOLIGADA'
        },
        {
          text: 'Nome',
          value: 'NOME'
        },
        {
          text: 'Curso',
          value: 'CURSO'
        },
        {
          text: 'CPF',
          value: 'CPF'
        },
        {
          text: 'Mês',
          value: 'MES'
        },
        {
          text: '4',
          value: 'ANO'
        },
        {
          text: 'Valor Fies',
          value: 'VLRFIES'
        },
        {
          text: 'Tipo Fies',
          value: 'TIPO_FIES'
        },
        {
          text: 'Lançamento',
          value: 'IDLAN'
        },
        {
          text: 'Repasse',
          value: 'IDLANREPASSE'
        },
        {
          text: 'Descrição',
          value: 'DESCRICAO'
        },
        {
          text: 'Status',
          value: 'STATUS'
        },
      ],
      items: null,
      baixa_lancamento: [],
    }
  },
  watch: {
    baixa_lancamento: function() {
      let currentObj = this
      if (this.baixa_lancamento.length === this.items.length) {
        const requests = this.items.map(item => {
          axios.put(this.host + '/update-status/' + item.ID, {
              STATUS: '4',
              DESCRICAO: 'Arquivo de baixa gerado.',
              RECMODIFIEDBY: this.usuario,
            })
            .then(function(response) {
              currentObj.output = response.data
            })
            .catch(function(error) {
              currentObj.output = error
            })
        })
        Promise.all(requests).finally(() => {
          SalvarArquivo(this.baixa_lancamento, 'Baixa Lançamento')
          this.loading = false
          alert('Registros alterados')
        })
      }
    },
    numdoc(newName) {
      localStorage.NUMDOC = newName
    },
  },
  beforeMount() {
    axios.defaults.headers.common["apikey"] = this.apikey
    axios.get(this.host + '/config')
      .then(response => {
        this.inicioEnvio = parseInt(response.data.inicioEnvio)
        this.fimEnvio = parseInt(response.data.fimEnvio)
      })
      .catch(error => {
        if (401 === error.response.status) {
          //  handle error: inform user, go to login, etc
          this.$router.push({
            path: '/login'
          })
          alert('Sessão expirada')
        } else {
          return Promise.reject(error);
        }
      })
  },
  mounted() {
    this.usuario = localStorage.usuario
    axios.get(this.host + "/resultados-fies?statuszero=null")
    //axios.get(this.host + "/resultados-fies?status=4")
      .then(response => {
        this.items = response.data.data
      })

      if (localStorage.NUMDOC === null) {
        localStorage.NUMDOC = 900000000000
      }
      else{
        if (localStorage.NUMDOC) this.numdoc = parseInt(localStorage.NUMDOC)
      }
  },
  methods: {
    gerarBaixa() {
      this.loading = true
      this.baixa_lancamento.push('\ufeff') // UTF-8 BOM
      for (var i = 0; i < this.items.length; i++) {
        let mes = this.items[i].MES
        let ano = this.items[i].ANO.toString().substr(-2)
        let datab = '02'+mes.padStart(2, '0')+ano
        axios.get(this.host + '/lancamentos?idlan=' + this.items[i].IDLANREPASSE)
          .then(response => {
            var resposta = response.data.data
            var historico = resposta[0].['HISTORICO'] + ' - ' + 'Realizado via importação de baixa'
            var colcxa = resposta[0].['CODCOLCXA']
            var codcxa = null
            var formapgto = null
            // Código da conta caixa e forma de pagamento
            if (colcxa === '1') {
              codcxa = '1086' // CAIXA ECONOMICA AG 4246-3 CC108-6
              formapgto = '16' // Transferência FIES - Banco
            }
            else if  (colcxa === '2'){
              codcxa = '12' // CAIXA ECONOMICA - AG. 0632-7 CC. 6720138
              formapgto = '10' // Transferência FIES - Banco
            }

            this.baixa_lancamento.push(
              'L' //Tipo da linha - Alfa 1
              +
              resposta[0].['CODFILIAL'].padStart(4, '0') // Numérico 4
              +
              resposta[0].['CODCFO'].padEnd(25, ' ') // Alfa 25
              +
              resposta[0].['CODTDO'].padEnd(10, ' ') // Alfa 10
              +
              resposta[0].['NUMERODOCUMENTO'].padEnd(40, ' ') // Alfa 40
              +
              //strdata.padStart(6, ' ') // Numérico
              datab.padStart(6, '0') // Data da baixa Numérico 6
              +
              //resposta[0].['VALORORIGINAL'].replace('.','').padStart(18, '0') // Numérico 18
              resposta[0].['VALORORIGINAL'].replace('.','').padStart(18, '0') // Numérico 18
              +
              ''.replace('.','').padStart(18, '0') // Numérico 18
              +
              ''.replace('.','').padStart(18, '0') // Numérico 18
              +
              //resposta[0].['CODCOLCXA'].padStart(4, '0') // Numérico 4
              colcxa.padStart(4, '0') // Numérico 4
              +
              //resposta[0].['CODCXA'].padEnd(10, ' ') // Alfa 10
              codcxa.padEnd(10, ' ') // Alfa 10
              +
              ' '.padEnd(20, ' ') // Número Contábil da Baixa - Alfa 20
              +
              '2'.padStart(5, '0') // Cód. Evento Contábil da Baixa - Numérico 5
              +
              ''.padStart(4, '0') // Numérico 4
              +
              ''.padEnd(3, ' ') // Série do documento - Alfa 3
              //' '.padEnd(3, ' ') // Série do documento - Alfa 3
              +
              ''.padStart(144, '0') // Opcionais - Numérico 144 (18 x 8)
              +
              ''.padStart(18, '0') // Valor Multa - Numérico 18
              +
              ''.padStart(4, '0') // Reutilização - Numérico 4
              +
              ''.padEnd(20, ' ') // Número do Cheque - Alfa 20
              +
              //''.padEnd(255, ' ') // Histórico - Alfa 255
              historico.padEnd(255, ' ') // Histórico - Alfa 255
              //resposta[0].['HISTORICO'].padEnd(255, ' ')
              +
              ''.padEnd(125, ' ') // Códigos da Tabela Opcional  - Alfa 125 (25 x 5)
              +
              ''.padEnd(140, ' ') // Valores Alfa - Alfa
              +
              ''.padStart(6, '0') // Data de geração do arquivo - Numérico
              +
              ''.padStart(24, '0') // Datas opcionais - Numérico 24 (4x 6)
              +
              ''.padEnd(8, ' ') // Série Documento (8 posições)  - Alfa 8
              +
              formapgto.padStart(6, '0') // IDFORMAPAGTO - Numérico
              +
              '\n'
              // Linha cóntábil DÉBITO
              +
              "C"
              +
              '1'.padStart(1, '0') // Débito/Crédito - Numérico 1. OBS: 1 = Débito 2 = Crédito
              +
              '3'.padStart(1, '0') // Inclusão/Baixa - Numérico 1 OBS: 3 = Baixa
              +
              resposta[0].['CODCOLCXA'].padStart(4, '0') // Cód. Coligada da Conta - Numérico 4
              +
              '1.1.2.02.007'.padEnd(40, ' ') // Código da conta caixa - Alpha 40
              +
              parseFloat(resposta[0].['VALORORIGINAL']).toFixed(2).toString().replace('.','').padStart(18, '0') // Valor - Numérico 18
              +
              resposta[0].['CODFILIAL'].padStart(4, '0') // Código da Filial - Numérico 4
              +
              ''.padEnd(25, ' ')  //Código do Departamento - Alfa 25
              +
              ''.padEnd(25, ' ') //Cód do Centro de Custos - Alfa 25
              +
              ''.padEnd(10, ' ') // Cód do Histórico Padrão - Alfa 10
              +
              ''.padEnd(250, ' ') //Complemento do Histórico - Alfa 250
              +
              '\n'
              // Linha cóntábil CRÉDITO
              +
              "C"
              +
              '2'.padStart(1, '0') // Débito/Crédito - Numérico 1. OBS: 1 = Débito 2 = Crédito
              +
              '3'.padStart(1, '0') // Inclusão/Baixa - Numérico 1 OBS: 3 = Baixa
              +
              resposta[0].['CODCOLCXA'].padStart(4, '0') // Cód. Coligada da Conta - Numérico 4
              +
              '1.1.2.02.007'.padEnd(40, ' ') // Código da conta - Alpha 40
              +
              parseFloat(resposta[0].['VALORORIGINAL']).toFixed(2).toString().replace('.','').padStart(18, '0') // Valor - Numérico 18
              +
              resposta[0].['CODFILIAL'].padStart(4, '0') // Código da Filial - Numérico 4
              +
              ''.padEnd(25, ' ')  //Código do Departamento - Alfa 25
              +
              ''.padEnd(25, ' ') //Cód do Centro de Custos - Alfa 25
              +
              ''.padEnd(10, ' ') // Cód do Histórico Padrão - Alfa 10
              +
              ''.padEnd(250, ' ') //Complemento do Histórico - Alfa 250
              +
              '\n'
            )
          })
          .catch(error => {
            if (500 === error.response.status) {
              alert('Request time excedido.')
            } else if (401 === error.response.status) {
              this.$router.push({
                path: '/login'
              })
              alert('Sessão expirada')
            } else {
              return Promise.reject(error);
            }
          })
      }
    }
  }
}
</script>
