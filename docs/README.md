![Header - PeladIn](https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2024-1-ti2-1372100-peladin/assets/136115980/78075f20-46af-422b-8f79-4081b80fc69c)


# PeladIn


* Ian dos Reis Novais - ian.novais@sga.pucminas.br
* João Antônio Nascimento Pires - janpires@sga.pucminas.br
* Joao Vitor Carvalho Domingos - joao.domingos.1494056@sga.pucminas.br
* Gabriel Lage Silva - gabriel.silva.1404255@sga.pucminas.br
* Marcos Carvalho Taveira de Souza - marcos.taveira@sga.pucminas.br
* Saulo José Nascimento Silva - saulo.jose@sga.pucminas.br

---

Professores:

* Eveline Alonso Veloso.
* Juliana Amaral Baroni de Carvalho.

---

Curso de Engenharia de Software

_Instituto de Informática e Ciências Exatas – Pontifícia Universidade Católica de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_

---

**Resumo:** 

O PeladIn nasceu como resultado de um projeto desenvolvido na disciplina de Trabalho Interdisciplinar: Aplicações para Processos de Negócios de Engenharia de Software, representando uma solução inovadora para a organização de peladas de futebol amador. Nosso principal objetivo é democratizar a marcação de peladas e otimizar o processo de agendamento, oferecendo uma excelente experiência ao usuário e simplificando a marcação de partidas e registro de quadras.

Observando o cenário atual, onde o futebol é o esporte mais praticado em todo o mundo, identificamos uma carência no mercado por um software que pudesse melhorar e agilizar esse processo. Assim, fundamos o PeladIn, uma plataforma que permite marcar e gerenciar peladas entre amigos e até mesmo desconhecidos, eliminando a necessidade de depender de grupos de WhatsApp desorganizados.

---


## 1. Introdução

Este projeto apresenta a criação de um sistema online voltado para a marcação de peladas, visando simplificar o processo de organização de jogos de futebol amador e proporcionar uma experiência mais eficiente aos seus usuários.

### 1.1 Contextualização

No cenário do futebol amador, a organização das peladas muitas vezes se torna uma tarefa desafiadora, requerendo coordenação manual de horários e locais através de mensagens em grupos. De acordo com um estudo da revista Medium, revelou-se que 14 dos 19 jogadores de pelada entrevistados, cerca de 73%, não utilizam nenhum método formal de organização para agendar as partidas. Além do mais, 89,5% dos organizadores fazem de 1 a 6 contatos até ter sucesso em marcar um jogo.
Um exemplo prático seria o seguinte: imagine que você, um organizador de pelada, envia mensagem para um rapaz questionando se ele teria interesse em participar de uma partida no fim de semana. O indivíduo, ocupado com seus afazeres diários, acaba respondendo apenas horas depois que irá participar - apenas para descobrir que sua vaga já fora tomada.

### 1.2 Problema

O problema enfrentado pelos jogadores de futebol amador são a dificuldade na localização e na marcação de peladas. A coordenação manual através de mensagens em grupos muitas vezes resulta em confusões, atrasos e dificuldades logísticas, impactando negativamente a experiência dos participantes.

### 1.3 Objetivo geral

No caso específico deste projeto, o objetivo deste trabalho é desenvolver um sistema para automação de processos para marcação de peladas.

#### 1.3.1 Objetivos específicos

- Gerenciamento de usuário: Esta funcionalidade permite aos usuários criarem uma conta no sistema. Eles fornecerão informações como nome, email, senha, e outras informações relevantes.
- Gerenciamento de quadra: Esta funcionalidade permite que os usuários autorizados cadastrem novas quadras esportivas no sistema, para que a marcação de peladas ocorra. Os detalhes sobre a quadra podem incluir nome, localização, descrição, fotos do local, disponibilidade, entre outros.
- Estatísticas de cada jogador: Esta funcionalidade envolve o registro das estatísticas individuais de cada jogador registrado no sistema. Isso inclui informações como número de partidas jogadas, número de gols, assistências, vitórias e derrotas, desempenho em jogo, entre outros.
- Marcação da pelada: Esta funcionalidade permite aos usuários agendar partidas esportivas em uma das quadras cadastradas no sistema. Eles podem especificar detalhes como data, horário, local, número de pessoas e afins.


### 1.4 Justificativas

Este trabalho justifica-se pela grande demanda para jogar um jogo de futebol amador e por isso, ferramentas que facilitem a organização de peladas de futebol amador, contribuindo com uma maior praticidade na gestão das partidas é importante para melhorar a experiência do praticante do esporte. Além disso, também ajudaria as pessoas que não conhecem muitos praticantes do esporte, que com o sistema poderão conhecer mais pessoas para jogar o futebol amador.

## 2. Participantes do processo

- Jogadores de futebol amador: Este grupo abrange indivíduos de diversas idades, gêneros, classes sociais e níveis de experiência no esporte. Eles terão a oportunidade de organizar suas partidas de futebol de forma mais eficiente e automatizada, facilitando a marcação de peladas e proporcionando uma experiência mais dinâmica.
- Dono da pelada: Este é aquele indivíduo responsável por organizar e coordenar as partidas de futebol amador em um determinado local. Geralmente, ele é um dos jogadores regulares que se encarrega de reservar campos, comunicar-se com os jogadores e garantir que as partidas ocorram conforme o planejado. O Dono da Pelada desempenha um papel crucial na facilitação das atividades esportivas e na criação de um ambiente amigável e organizado para os participantes.
- Proprietários e administradores de quadras de futebol: Este segmento inclui aqueles que gerenciam e possuem espaços esportivos, como quadras de futebol. Eles poderão cadastrar suas instalações no sistema, tornando-as disponíveis para locação pelos jogadores interessados em realizar suas partidas. Isso oferece uma oportunidade de ampliar o alcance de seus negócios e aumentar a utilização de suas instalações.


## 3. Modelagem do processo de negócio

### 3.1. Análise da situação atual

Atualmente, os aplicativos de organização de peladas, como Appito e Chega+, têm como objetivo simplificar a marcação e participação em jogos de futebol amador. No entanto, os usuários enfrentam frequentemente dificuldades, como encontrar partidas disponíveis devido à falta de clareza nos horários. Além disso, o gerenciamento de atividades durante e após as partidas também é limitado, levando muitos usuários a registrarem estatísticas em papel. Um desafio adicional é a falta de democratização no acesso a diferentes tipos de quadras. Por exemplo, o Appito oferece apenas opções de quadras pré-definidas por eles e que possuem altos custos, limitando a escolha dos jogadores e excluindo aqueles que preferem locais mais acessíveis. Essas limitações ressaltam a necessidade de uma abordagem mais integrada, democratizada e eficaz para melhorar a experiência de organização e participação em peladas.

### 3.2. Descrição geral da proposta

Nosso objetivo consiste em ampliar as capacidades que as ferramentas vigentes do mercado atualmente possuem, e corroborar com a automatização dos processos em nossa aplicação. Buscamos facilitar os processos de formação de times e de aluguel de quadras, possibilitando os usuários uma organização mais sólida. 

Queremos democratizar a organização das quadras, tornando-as mais acessíveis e populares. Embora não possamos definir preços específicos para as quadras (uma vez que serão os próprios usuários que as cadastrarão), a ampla variedade de opções permitirá que os usuários aluguem conforme suas preferências e orçamento. Isso significa que desde quadras mais simples em bairros residenciais até instalações mais sofisticadas em clubes poderão ser encontradas na plataforma, atendendo às necessidades e preferências de uma ampla gama de jogadores.

Além dessas melhorias, implementantaremos uma funcionalidade especial para caronas. Sabemos que muitos jogadores enfrentam dificuldades para chegar às partidas, seja por falta de transporte próprio ou por questões logísticas. Portanto, estamos planejando integrar uma função que permita aos usuários oferecerem e solicitarem caronas para os jogos, facilitando assim a participação de todos os interessados, independentemente de sua localização ou disponibilidade de transporte próprio.

Com essas melhorias, buscamos não apenas ampliar e melhorar as opções disponíveis para os usuários, mas também tornar a experiência de organização e participação em peladas mais inclusiva, acessível e conveniente para todos os envolvidos.

### 3.3. Modelagem dos processos

[PROCESSO 1 - Gerenciamento de usuário](processo-1-gerenciamento-de-usuario.md "Detalhamento do Processo 1.")

[PROCESSO 2 - Gerenciamento de quadra](processo-2-gerenciamento-de-quadra.md "Detalhamento do Processo 2.")

[PROCESSO 3 - Estatísticas do jogador](processo-3-estatisticas-do-jogador.md "Detalhamento do Processo 3.")

[PROCESSO 4 - Marcação da pelada](processo-4-marcacao-da-pelada.md "Detalhamento do Processo 4.")

## 4. Projeto da solução

O documento a seguir apresenta o detalhamento do projeto da solução. São apresentadas duas seções que descrevem, respectivamente: modelo relacional e tecnologias.

[Projeto da solução](solution-design.md "Detalhamento do projeto da solução: modelo relacional e tecnologias.")


## 5. Indicadores de desempenho

O documento a seguir apresenta os indicadores de desempenho dos processos.

[Indicadores de desempenho dos processos](performance-indicators.md)


## 6. Interface do sistema

A sessão a seguir apresenta a descrição do produto de software desenvolvido. 

[Documentação da interface do sistema](interface.md)

## 7. Conclusão

O curso de Engenharia de Software, com a disciplina Trabalho Interdisciplinar: Aplicações para Processos de Negócios, abriu caminho para a criação do PeladIn, um software voltado para facilitar a organização de peladas de futebol amador. Em um curto período, os integrantes do projeto contribuíram significativamente, saindo de suas zonas de conforto e explorando novas tecnologias e plataformas.

Durante o desenvolvimento do PeladIn, ficou evidente a importância de uma comunicação eficaz entre os membros da equipe, além da necessidade de um planejamento detalhado e organizado. A divisão de tarefas e a colaboração foram cruciais para o sucesso do projeto, permitindo que cada integrante aplicasse suas habilidades e conhecimentos na construção do software.

Foram utilizadas diversas tecnologias e ferramentas que possibilitaram a criação de um software funcional e eficiente. No desenvolvimento back-end, utilizou-se a linguagem Java com Spring Boot; para o front-end, foram empregados HTML, CSS e JavaScript; e para o banco de dados, utilizou-se o HeidiSQL. A adoção de metodologias ágeis, como Scrum, permitiu à equipe adaptar-se rapidamente às mudanças e priorizar as tarefas mais críticas para o desenvolvimento.

Ao longo do projeto, foram identificados e superados diversos desafios e obstáculos, assim como potenciais melhorias que poderiam ser implementadas futuramente. Apesar das dificuldades, o resultado final foi um software funcional e eficiente, que atendeu às expectativas e necessidades dos usuários, proporcionando uma experiência mais organizada para a gestão de peladas de futebol amador.

Algumas melhorias futuras que poderiam ser implementadas no software incluem:

1. Integração com redes sociais.
2. Implementação de um sistema de chat direto entre usuários.
3. Implementação de uma loja de produtos dentro da plataforma.
4. Melhorias no desempenho do site.
   
Em resumo, o desenvolvimento do PeladIn foi uma experiência enriquecedora e desafiadora para toda a equipe, que pôde aplicar e adquirir novos conhecimentos e habilidades em um projeto prático e relevante. O software desenvolvido tem o potencial de se tornar uma ferramenta essencial para a organização de peladas de futebol amador, oferecendo uma experiência mais eficiente e estruturada para seus usuários.

# REFERÊNCIAS

[1.1] MEDIUM. Estudo de caso-Vai ter jogo!. Disponível em: https://medium.com/@vieiraleonardo. Acesso em: 27 fev. 2024.

[1.2] APPITO. Tudo sobre o aplicativo e o futebol amador. Disponível em: https://blogapitador.wordpress.com/. Acesso em: 28 fev. 2024.

[1.3] JOGA. Pelada é coisa séria: regras básicas para organizar o futebol entre amigos. Disponível em: https://wearejoga.com/blog/pelada-e-diversao/organizar-futebol-entre-amigos/. Acesso em: 03 mar. 2024.

# APÊNDICES

## Apêndice A - Código fonte

[Código do front-end](../src/front) -- Repositório do código do front-end

[Código do back-end](../src/back)  -- Repositório do código do back-end


## Apêndice B - Apresentação final

[Slides da apresentação final](presentations/PeladIn.pptx)

[Vídeo da apresentação final](video/peladin.mp4)






