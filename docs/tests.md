## 7. Testes do software

Nesta sessão são apresentados os testes realizados no software implementado:

_Deve ser utilizada a abordadem caixa preta, que tem por objetivo verificar a conformidade do software com os requisitos funcionais e não-funcionais do sistema._

_Se quiser conhecer um pouco mais sobre os tipos de teste de software, leia o documento [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)._

_Nesta seção o grupo deverá documentar os testes de software que verificam a correta implementação dos requisitos funcionais e não-funcionais do software. Preencha a tabela com o plano de testes. Para cada Caso de Teste (CT), associe quais testes são responsáveis por verificar a conformidade do caso de teste. Veja a tabela de exemplo._


**Caso de Teste** | **CT01 - Cadastrar usuário**
 :--------------: | ------------
**Procedimento**  | Cadastrar novo usuário. |
**Dados de entrada** | Inserção de dados válidos no formulário de cadastro. |
**Resultado obtido** | Dado cadastrado com sucesso. |
**Teste associado** | `UsuarioTest.testNewUser()` |

**Caso de Teste** | **CT02 - Cadastrar usuário já existente**
 :--------------: | ------------
**Procedimento**  | Cadastrar usuário já existente.
**Dados de entrada** | Inserção de dados válidos com nome de usuário já existente no banco.
**Resultado obtido** | Dado não cadastrado.
**Teste associado** | `UsuarioTest.testExistingUser()` |


## Avaliação dos Testes de Software

_Discorra sobre os resultados do teste, ressaltando pontos fortes e fracos identificados na solução. Comente como o grupo pretende atacar esses pontos nas próximas iterações. Apresente as falhas detectadas e as melhorias geradas a partir dos resultados obtidos nos testes._

## Testes das funções JavaScript (Opcional)

_Se o grupo tiver interesse em se aprofundar no desenvolvimento de testes de software, ele poderá desenvolver testes automatizados de software que verificam o funcionamento das funções JavaScript desenvolvidas no front-end. Para conhecer sobre testes em JavaScript, leia o documento  [Ferramentas de Teste para Java Script](https://geekflare.com/javascript-unit-testing/)._

