<?php
//Goutte é uum web scrapper para PHP.
namespace App\Http\Controllers\PIT;

//use GuzzleHttp\Client;
use Goutte\Client;
use Illuminate\Http\Request;
use App\Models\PIT\GUSRPERFIL;
use App\Models\PIT\PPESSOA;
use App\Models\PIT\PFUNC;
use Illuminate\Support\Str;
use App\Users;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Log;

class LoginController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function index(Request $request)
    {
        //Parâmetros da URL, baseados no portal antigo do RM. Para o novo portal, basta substituir os campos de entrada e URL.
        $client = new Client();
        $usuario = $request->usuario;
        $senha = $request->senha;
        //Novo Web Scraper na página do portal
        $browser = $client->request('GET', 'http://portal.suainstituicao.com.br/Corpore.Net/Login.aspx?autoload=false');
        //Enviar login para a URL
        // Pelo fato de ser scrapping, não é necessário fornecer TODOS os parâmetros do formulário para o post,
        // apenas usuário e senha.
        $form = $browser->selectButton('Acessar')->form();
        $browser = $client->submit($form, array('txtUser' => $usuario, 'txtPass' => $senha));
        // Dá um GET na página do usuário logado.
        $inicio = $client->request('GET', 'http://portal.suainstituicao.com.br/Corpore.Net/Main.aspx?SelectedMenuIDKey=Inicio');
        // Testa a obtenção do nome de usuário no Portal do RM.
        // Não é possível veriricar se está logado por status da resposta, pois a resposta padrão tem status 200 independente
        // da situação.
        if ($inicio->filterXPath('//*[@id="lbContextInfo"]')->count()) {
            //Gera a chave no cache com um tempo de vida determinado.
            $apikey = Str::random(60);
            $expiracao = Carbon::now()->addMinutes(60);
            $perfil = GUSRPERFIL::where('GUSRPERFIL.CODUSUARIO', '=', $usuario)->get();
            // Se na consulta de código de perfil houver o perfil 'Coordenacao' o usuário será identificado no sistema com o código de perfil COORD.
            foreach ($perfil as $linha) {
                $codperfil = $linha->CODPERFIL;
                $codsistema = $linha->CODSISTEMA;
                if ($codperfil == 'FinanceiroAvan' && $codsistema == 'F') {
                    $codperfil = 'FIES';
                    break;
                } elseif ($codperfil == 'IGUAÇU' && $codsistema == 'P') {
                    $codperfil = 'RH';
                    break;
                } elseif ($codperfil === 'Coordenacao') {
                    $codperfil = 'COORD';
                    break;
                } elseif ($codperfil == 'Administrador' or $codperfil == 'aux.administra' and $linha->CODPERFIL == 'F' or $codperfil =='DBA') {
                    $codperfil = 'ADM';
                    break;
                } elseif ($codperfil == 'Administracao') {
                      $codperfil = 'PIT';
                      break;
                } else {
                    $codperfil = null;
                }
            }
            $codpessoaquery = PPESSOA::select('codigo')->where('PPESSOA.cpf', '=', $usuario)->orWhere('PPESSOA.CODUSUARIO', '=', $usuario)->get();
            foreach ($codpessoaquery as $linha) {
                $codpessoa = $linha->codigo;
            }
            // A chave de API é guardada no CACHE. Válida por uma hora.
            Cache::put($apikey, [$apikey, $usuario, ], $expiracao);
            Log::info('Usuário logado', ['usuario' => $usuario, 'apikey' => $apikey]);
            return response()->json(['status' => 'success', 'apikey' => Cache::get($apikey), 'codpessoa' => $codpessoa, 'usuario' => $usuario, 'codperfil' => $codperfil], 200);
        } else {
            Log::error('Falha no login', ['usuario' => $usuario]);
            return response()->json(['status' => 'fail'], 401);
        }
    }
}
