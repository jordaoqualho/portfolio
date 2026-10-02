// Portuguese text for the human-facing site. Only words live here: numbers,
// dates, links, slugs and technologies always come from profile.ts, so the
// two languages cannot drift apart on facts. Keys match the English data
// (case slug, section id, project name, company).

export type SectionText = { heading: string; body?: string; points?: string[] };
export type CaseText = {
  category: string;
  title: string;
  summary: string;
  sections: Record<string, SectionText>;
};
export type ProjectText = {
  status: string;
  description: string;
  byline?: string;
  detail?: {
    tagline: string;
    imageAlt?: string;
    overview: string;
    features: string[];
    engineering: string[];
    motivation?: string[];
    engineeringIntro?: string;
    engineeringNote?: string;
    callout?: { title: string; body: string };
    decision?: string[];
    limits?: string[];
    credit?: string;
  };
};
export type RoleText = { title: string; summary: string; note?: string };

export const ptProfile = {
  role: "Engenheiro de Software Sênior",
  availability: "Aberto a oportunidades remotas internacionais selecionadas",
  location: "Brasil",
  languages: "Inglês C1 avançado · Português nativo",
  stats: [
    {
      label: "anos em produção",
      detail: "Desde 2020 em fintech, e-commerce, SaaS e logística",
    },
    {
      label: "usuários na plataforma",
      detail: "Plataforma financeira onde rastreei uma falha mascarada no onboarding",
    },
    {
      label: "usuários simultâneos em teste de carga",
      detail: "Depois que um evento ao vivo passou de 12 mil, no mesmo orçamento",
    },
    {
      label: "componentes React compartilhados",
      detail: "Biblioteca em Storybook entre micro-frontends de saúde",
    },
  ],
  facets: {
    violin: "violinista em uma orquestra",
    theology: "estudante de Teologia",
    piano: "pianista",
    dm: "mestre de D&D",
    chess: "jogador de xadrez",
  } as Record<string, string>,
  skillGroups: {
    Backend: "Backend",
    Frontend: "Frontend",
    Data: "Dados",
    "Cloud & infrastructure": "Cloud e infraestrutura",
    Engineering: "Engenharia",
  } as Record<string, string>,
  currentlyBuilding:
    "Experimentando fluxos de desenvolvimento com IA, memória compartilhada entre agentes e ferramentas para desenvolvedores.",
  about: [
    "Sou Engenheiro de Software Sênior no Brasil, com mais de 6 anos de experiência em produção em fintech, e-commerce, SaaS e logística. Trabalho em inglês (C1) com times remotos da América Latina e dos Estados Unidos.",
    "Meu trabalho é Full Stack, com mais tempo dedicado a sistemas de backend, APIs, infraestrutura em nuvem e confiabilidade em produção.",
    "Rendo melhor em times que esperam que engenheiros investiguem o comportamento real em produção e participem das decisões técnicas, não apenas fechem tickets.",
    "Fora da engenharia, toco violino em uma orquestra, estudo Teologia, toco piano, mestro campanhas de D&D e jogo xadrez.",
  ],
  principles: [
    {
      title: "Depuro a partir de evidências, não de suposições.",
      detail: "Logs, traces e o comportamento em produção vêm antes das hipóteses.",
    },
    {
      title: "Observabilidade precisa existir antes de a produção falhar.",
      detail: "O sistema deve nos dizer o que deu errado antes que um cliente precise dizer.",
    },
    {
      title: "IA acelera a engenharia; não substitui o entendimento.",
      detail:
        "Uso agentes intensamente, mas arquitetura, revisão e responsabilidade por produção continuam sendo decisões humanas.",
    },
  ],
  contact: {
    title: "Procurando um Engenheiro de Software Sênior?",
    description:
      "Aberto a oportunidades selecionadas de Backend e Full Stack Sênior com times remotos internacionais.",
  },
  roles: {
    "Afinz / client Sem Parar": {
      title: "Engenheiro de Backend Sênior · Contrato / B2B",
      summary:
        "Engenheiro de backend e líder técnico de uma squad de serviços financeiros no Sem Parar, plataforma com mais de 7 milhões de usuários ativos. Investiguei incidentes em produção, conduzi integrações de API com o time de produto e melhorei testes, documentação e onboarding.",
    },
    Sully: {
      title: "Engenheiro Full Stack Sênior · Consultoria / B2B",
      summary:
        "Projeto curto em um produto de saúde dos Estados Unidos com fluxos de atendimento apoiados por IA. Construí uma biblioteca de mais de 50 componentes React documentada em Storybook a partir dos designs do Figma, integrei-a aos micro-frontends existentes e adaptei manifests de ArgoCD para novos serviços.",
      note: "Projeto via Tecla. Terminou quando o cliente decidiu não renovar o contrato por motivos comerciais ligados a prazo e custo.",
    },
    "ROIT GROUP": {
      title: "Engenheiro Full Stack Sênior",
      summary:
        "Trabalhei em microsserviços NestJS para rotas analíticas do produto. Desenhei o cache e a invalidação com Redis e elevei a cobertura de testes automatizados para mais de 85% nos serviços principais.",
    },
    "Voyager Portal": {
      title: "Engenheiro Full Stack Sênior",
      summary:
        "Plataforma de logística marítima. Reescrevi um microsserviço de relatórios de Python para TypeScript para reduzir o uso de memória e acabar com falhas em tempo de execução, e construí interfaces Vue.js com estado para os times de operação.",
    },
    "Grupo Soma": {
      title: "Engenheiro Full Stack e Tech Lead",
      summary:
        "Plataforma de live commerce no Google Cloud Run. Depois que um evento passou de 12.000 usuários simultâneos, trabalhei com o time de infraestrutura em testes de carga e ajustes de autoscaling até os testes sustentarem cerca de 20.000 dentro do orçamento. Depois, assumi responsabilidades de Tech Lead por um período, incluindo mentoria e padrões de code review.",
    },
    "Cria Studio": {
      title: "Engenheiro Full Stack",
      summary:
        "Único engenheiro de um produto React 2D interativo, das decisões técnicas e de produto até o lançamento em produção.",
    },
    "Lorena Felicio": {
      title: "Engenheiro Full Stack",
      summary:
        "Construí um ERP do zero em React, Node.js, MongoDB e AWS S3, incluindo integrações fiscais e de emissão de notas brasileiras e fluxos automatizados de documentos.",
    },
  } as Record<string, RoleText>,
  cases: {
    "financial-onboarding-incident": {
      category: "Depuração em produção · Fintech",
      title: "Rastreando uma falha mascarada em um fluxo de onboarding financeiro",
      summary:
        "Mais de 100 clientes falharam na criação de conta ao mesmo tempo, e cada retry devolvia um erro do provider que escondia o verdadeiro. Reconstruí a sequência de requisições a partir dos logs do CloudWatch, o que levou o time à primeira falha, à correção e à recuperação das contas afetadas.",
      sections: {
        context: {
          heading: "Contexto",
          body: "Uma plataforma financeira com mais de 7 milhões de usuários. A criação de conta dependia de um provider financeiro externo, e o backend refazia automaticamente as chamadas que falhavam.",
        },
        incident: {
          heading: "Incidente",
          body: "Por volta das 10h, mais de 100 clientes falharam na criação de conta quase ao mesmo tempo. Cada um tinha sido tentado de novo mais de 10 vezes, e todos os retries falhavam com a mesma resposta do provider: “Customer Already Exists.”",
        },
        investigation: {
          heading: "Investigação",
          points: [
            "O Command Center detectou o pico de erros no Grafana. Minha parte foram os logs.",
            "No AWS CloudWatch, reconstruí a sequência de chamadas ao provider para os clientes afetados, começando pela primeira requisição e não pelo erro mais recente.",
            "A primeira requisição tinha falhado de outro jeito: o provider criava o customer, mas não completava a conta, porque a data de vencimento era inválida.",
            "Isso tornava “Customer Already Exists” um erro secundário: o provider estava corretamente se recusando a criar o mesmo customer duas vezes.",
            "Colegas que conheciam as regras de negócio do provider confirmaram quais datas de vencimento ele rejeitava.",
          ],
        },
        "root-cause": {
          heading: "Causa raiz",
          points: [
            "Criação parcial: na primeira chamada, o provider criava o customer e parava antes de criar a conta.",
            "Uma regra não documentada do provider: a data de vencimento não podia passar do dia 28. Nosso fluxo não aplicava essa regra.",
            "Os retries mascaravam a causa: cada retry repetia a criação de um customer que agora já existia, então o provider respondia “Customer Already Exists.” O motivo real só aparecia na primeira resposta, debaixo de dez ou mais falhas idênticas.",
          ],
        },
        contribution: {
          heading: "Minha contribuição",
          points: [
            "Investiguei os logs do CloudWatch e reconstruí o fluxo de requisições dos clientes afetados.",
            "Identifiquei a data de vencimento inválida como a falha original, e “Customer Already Exists” como efeito colateral dos retries.",
          ],
        },
        fix: {
          heading: "Correção e recuperação",
          body: "Feito em time:",
          points: [
            "Validação no frontend e no backend, para que datas de vencimento depois do dia 28 não cheguem mais ao provider.",
            "Testes automatizados para a regra do dia 28.",
            "Um script de recuperação para os clientes travados que pulava a criação do customer, já que o provider tinha feito essa etapa.",
          ],
        },
        result: {
          heading: "Resultado",
          points: [
            "Cerca de 100 clientes recuperados.",
            "Resolvido em cerca de 4 horas.",
            "Esse erro deixou de gerar chamados depois da correção.",
          ],
        },
        takeaway: {
          heading: "Lição de engenharia",
          body: "Retries automáticos só são seguros quando a chamada é tudo ou nada. Quando um provider pode falhar no meio do caminho, o retry deixa de ser a mesma requisição: ele roda sobre um estado novo e recebe um erro novo. Em uma cadeia de chamadas, encontre a primeira falha de uma requisição afetada antes de confiar no erro que todo mundo está olhando, e faça a recuperação continuar a partir da etapa que já deu certo.",
        },
      },
    },
    "live-commerce-traffic-spike": {
      category: "Escalabilidade · Live commerce",
      title: "Lidando com um pico de 12 mil usuários em um evento de live commerce",
      summary:
        "Uma live de vendas reuniu mais de 12.000 usuários simultâneos, cerca do dobro do pico normal e uma carga que a plataforma nunca tinha testado. Depois de manter o evento no ar, reproduzimos o pico com testes de carga e ajustamos o autoscaling do Cloud Run até os testes sustentarem cerca de 20.000 usuários com o mesmo orçamento de infraestrutura.",
      sections: {
        context: {
          heading: "Contexto",
          body: "Uma plataforma de live commerce usada em lives de vendas de uma grande marca de moda brasileira. Os eventos costumavam chegar a cerca de 6.000 usuários simultâneos; um passou de 12.000. O backend rodava no Google Cloud Run depois de uma migração recente da AWS para o GCP, e a plataforma nunca tinha sido testada com essa carga.",
        },
        "what-failed": {
          heading: "O que falhou",
          points: [
            "O banco saturou primeiro, principalmente em CPU e memória, e a pressão se espalhou pelo resto da infraestrutura.",
            "A capacidade não crescia rápido o bastante. Milhares de pessoas entraram de uma vez e, entre cold starts e a configuração de autoscaling, as novas instâncias chegavam depois que a demanda já estava lá.",
            "A migração era recente, mas o problema só apareceu com esse nível de tráfego.",
          ],
        },
        response: {
          heading: "Resposta imediata",
          body: "O evento estava ao vivo, então estabilidade vinha antes do diagnóstico. Os recursos foram aumentados emergencialmente para manter a plataforma no ar durante o evento. Isso ganhou tempo, não uma explicação.",
        },
        reproducing: {
          heading: "Reproduzindo a falha",
          points: [
            "Depois do evento, reproduzimos a carga em condições controladas com o Taurus.",
            "Os desenvolvedores simularam milhares de usuários simultâneos, aumentando a carga passo a passo.",
            "Métricas e logs em cada etapa mostravam quais limites eram atingidos primeiro.",
          ],
        },
        changes: {
          heading: "Mudanças",
          body: "Com o time de infraestrutura, ajustamos a infraestrutura e o autoscaling do Cloud Run, testamos de novo e repetimos. Cada rodada buscava o equilíbrio entre capacidade suficiente para absorver milhares de usuários chegando ao mesmo tempo e o custo de manter essa capacidade disponível.",
        },
        contribution: {
          heading: "Minha contribuição",
          body: "Como Desenvolvedor Sênior, trabalhei com o time de infraestrutura em:",
          points: [
            "Rodar os testes de carga com Taurus e ler os resultados junto com métricas e logs.",
            "Analisar onde estavam os limites e participar de cada rodada de ajustes de autoscaling e capacidade.",
            "Testar de novo depois de cada mudança.",
          ],
        },
        result: {
          heading: "Resultado",
          body: "Depois dos ajustes, os testes de carga sustentaram cerca de 20.000 usuários simultâneos sem ultrapassar o orçamento de infraestrutura definido para esse cenário. É um resultado de teste de carga, não de um evento posterior em produção.",
        },
        takeaway: {
          heading: "Lição de engenharia",
          body: "Um pico é um problema diferente de crescimento. O autoscaling reage a uma demanda que já existe, então, quando milhares de pessoas chegam no mesmo minuto, os cold starts decidem se a capacidade aparece a tempo. Um teste de carga que sobe devagar passa em um sistema que falha numa live; ele precisa reproduzir a entrada simultânea. A partir daí, performance é um equilíbrio entre capacidade, velocidade de reação e o custo de mantê-la pronta.",
        },
      },
    },
    "healthcare-react-component-system": {
      category: "Arquitetura frontend · Saúde",
      title: "Construindo um sistema React compartilhado entre micro-frontends de saúde",
      summary:
        "Um produto de saúde dos Estados Unidos precisava de uma experiência personalizada para um grande cliente hospitalar, distribuída em vários micro-frontends React. Em um projeto curto, construí uma biblioteca de mais de 50 componentes documentada em Storybook a partir dos designs do Figma, para que esses frontends compartilhassem uma base de interface.",
      sections: {
        context: {
          heading: "Contexto",
          body: "Trabalhei via Tecla em um projeto curto para uma empresa de saúde dos Estados Unidos. O produto existente usava transcrição de áudio e agentes de IA para apoiar fluxos de atendimento em hospitais, como organizar informações clínicas e consultar conhecimento médico e artigos. Um grande cliente hospitalar pediu uma experiência personalizada, que envolvia vários frontends que precisavam evoluir de forma consistente.",
        },
        constraints: {
          heading: "Restrições",
          points: [
            "Várias aplicações: um shell principal cujo menu levava a frontends separados.",
            "Os micro-frontends tinham sido escolhidos antes da minha entrada.",
            "Todos os frontends precisavam seguir os mesmos designs do Figma.",
            "Trabalho direto com stakeholders dos Estados Unidos.",
            "Um prazo curto.",
          ],
        },
        built: {
          heading: "O que construí",
          points: [
            "Um Storybook para o time.",
            "Uma biblioteca interna de componentes React construída a partir dos designs do Figma: mais de 50 componentes, incluindo botões, inputs, chat e modais.",
            "A integração da biblioteca nos micro-frontends, com adaptações onde cada um precisava.",
            "Manifests de ArgoCD para os novos serviços, adaptados dos existentes mudando o serviço e os recursos.",
          ],
        },
        architecture: {
          heading: "Arquitetura: o que foi meu",
          points: [
            "Já existia: a arquitetura de micro-frontends, o shell que levava a frontends separados e o setup de deploy com ArgoCD usado por outros serviços.",
            "Minha implementação: a biblioteca de componentes, o Storybook como referência visual, a integração da biblioteca nos frontends e os manifests de ArgoCD dos novos serviços.",
          ],
        },
        fhir: {
          heading: "Dados FHIR na interface",
          body: "Parte dos dados do domínio seguia o FHIR, o padrão de interoperabilidade em saúde usado pelo backend. Ajudei a adaptar os dados FHIR de que a interface precisava para um formato que o frontend conseguisse exibir.",
        },
        result: {
          heading: "Resultado",
          points: [
            "Uma biblioteca compartilhada com mais de 50 componentes reutilizáveis em uso.",
            "O Storybook como referência do time para a implementação visual.",
            "Vários frontends construídos sobre a mesma base.",
            "Um MVP funcionando.",
          ],
        },
        ending: {
          heading: "Fim do projeto",
          body: "O projeto terminou quando o cliente decidiu não continuar o contrato por motivos comerciais ligados a prazo e custo.",
        },
        takeaway: {
          heading: "Lição de engenharia",
          body: "Micro-frontends trazem independência, mas cada fronteira também é um lugar onde botões, inputs e modais são reconstruídos de um jeito um pouco diferente. Sem uma base compartilhada, essa independência vira fragmentação e duplicação. Uma biblioteca de componentes com uma referência visual única permite que os frontends fiquem separados no código e ainda pareçam um só produto.",
        },
      },
    },
  } as Record<string, CaseText>,
  projects: {
    iMemory: {
      status: "Público",
      description:
        "Um painel local para a memória compartilhada entre agentes de código. Busque o que eles lembram, inspecione handoffs de sessão e limpe o contexto sem mexer no banco de dados.",
      byline: "Construído como interface web para o ai-memory, servidor MCP open source de Fabio Akita.",
      detail: {
        tagline: "Uma central local para a memória de longo prazo compartilhada por agentes de código",
        imageAlt:
          "Tela de visão geral do iMemory: seletor de projetos, busca, contadores de memórias salvas, sessões, eventos capturados e handoffs pendentes, e listas de memórias recentes e handoffs prontos para continuar.",
        overview:
          "O iMemory é uma interface web para o ai-memory, o servidor MCP open source de Fabio Akita para memória local e persistente entre agentes de código. Em vez de dar a cada agente um contexto isolado, o ai-memory permite que o Claude Code e outros agentes compatíveis com MCP reutilizem as mesmas memórias, handoffs de sessão e conhecimento de projeto na sua própria máquina. O iMemory transforma esse motor em um painel prático: um lugar para ver o que os agentes lembram, buscar entre projetos, revisar sessões anteriores e gerenciar a memória que eles compartilham. Ele não é um fork nem substitui o ai-memory. O servidor continua sendo a fonte da verdade e monta o iMemory como sua interface web via --web-ui-dir.",
        features: [
          "Mostra projetos, memórias recentes e busca em uma só visão geral.",
          "Permite inspecionar as memórias de cada projeto.",
          "Torna visíveis as sessões e os handoffs dos agentes, em vez de deixá-los escondidos nas ferramentas.",
          "Oferece limpeza com prévia antes de aplicar mudanças.",
          "Permite excluir com desfazer.",
          "Permite salvar explicitamente a sessão atual quando você quer preservar o contexto de um agente.",
        ],
        motivation: [
          "Quando comecei a usar vários agentes de código, o principal problema não era gerar código. Era manter o contexto consistente entre eles. Uma decisão tomada em uma sessão podia sumir na ferramenta seguinte, e reconstruí-la gasta tempo e tokens e torna os handoffs menos confiáveis.",
          "O ai-memory resolve armazenamento e recuperação. Construí o iMemory para tornar essa memória compartilhada observável e gerenciável: ver o que está sendo lembrado, quais sessões criaram cada memória e limpar tudo sem mexer diretamente em arquivos internos ou bancos de dados.",
        ],
        callout: {
          title: "Uma única fonte da verdade.",
          body: "A interface não contorna o motor de memória: a leitura usa a API pública, e a escrita segue o mesmo caminho MCP usado pelos agentes.",
        },
        engineeringIntro: "A interface é propositalmente enxuta.",
        engineering: [
          "A leitura usa a API REST pública do ai-memory em /api/v1.",
          "As operações de escrita usam as mesmas ferramentas MCP expostas aos agentes, em vez de criar um caminho de escrita privado.",
          "A interface é HTML, CSS e JavaScript puros, sem etapa de build no frontend.",
          "O próprio servidor do ai-memory serve a interface via --web-ui-dir.",
          "O repositório também pode funcionar como diretório de dados local do ai-memory.",
        ],
        engineeringNote:
          "Esse último ponto exigiu tratar os dados locais como sensíveis por padrão. Um .gitignore que nega tudo por padrão só deixa entrar no Git a interface, a documentação e os arquivos públicos, enquanto o banco de memória, a wiki, a configuração, os logs, os backups e os dados locais dos projetos ficam na máquina.",
        decision: [
          "O iMemory não é um fork, de propósito. O servidor, os hooks, o motor de memória e a implementação MCP continuam vindo de akitaonrails/ai-memory. Isso mantém o projeto pequeno e permite que a interface evolua sem duplicar o sistema de memória por baixo.",
        ],
        credit:
          "Construído sobre o ai-memory v2.4. O motor e sua licença (MIT) pertencem a akitaonrails/ai-memory.",
      },
    },
    Roundkeep: {
      status: "No ar",
      description:
        "Uma mesa de combate local para D&D 5e. Iniciativa, biblioteca SRD offline, importação do Improved Initiative e visão dos jogadores na mesma rede. Sem conta e sem nuvem.",
      detail: {
        tagline: "Uma mesa de combate de D&D 5e que funciona sem internet",
        imageAlt:
          "Tela de encontro do Roundkeep: biblioteca de criaturas à esquerda, ordem de iniciativa com PV e classe de armadura no centro e a ficha da criatura selecionada à direita.",
        overview:
          "O Roundkeep conduz um combate de D&D 5e no navegador: iniciativa, PV, condições e uma biblioteca de criaturas e magias do SRD. Ele roda na máquina do mestre, sem conta e sem nuvem, e os jogadores acompanham o combate pelo celular na mesma rede.",
        features: [
          "Mesa de combate com turnos, rodadas, iniciativa editável, dano, cura, PV temporário e condições.",
          "Biblioteca offline com 331 criaturas e 319 magias do SRD 2024.",
          "Importação do Improved Initiative ou de backups do Roundkeep, com uma etapa de revisão antes de salvar.",
          "Visão dos jogadores em /p/{id} para celulares na rede local.",
          "Backups portáteis em JSON para levar uma campanha para outro dispositivo.",
          "Atalhos de teclado para próximo turno, busca na biblioteca, dados e desfazer.",
        ],
        engineering: [
          "A visão dos jogadores atualiza ao vivo via Socket.IO na rede local, com BroadcastChannel como alternativa dentro do mesmo navegador.",
          "Os catálogos ficam no IndexedDB e o encontro é salvo a cada mudança. Depois do primeiro carregamento, um service worker faz o build de produção funcionar offline, com versões de cache geradas no build.",
          "Web Locks permitem que só uma aba do mestre edite a campanha por vez, para que duas abas nunca sobrescrevam uma à outra. As janelas dos jogadores ficam abertas em paralelo.",
          "A mesa fica disponível na rede local, mas o endpoint de bootstrap que serve os dados privados da campanha só responde em loopback. Não é uma sala pública na nuvem.",
          "O catálogo SRD é convertido do Open5e v2 por um script Python reproduzível, com créditos e licenças incluídos no app.",
          "Os testes cobrem regras de encontro, dados do catálogo e importação.",
        ],
        credit:
          "As criaturas vêm do SRD 5.2 (2024) via Open5e, sob CC BY 4.0. As magias vêm do catálogo básico distribuído pelo Improved Initiative.",
      },
    },
    Deadfolio: {
      status: "No ar",
      description:
        "Encontra repositórios abandonados no GitHub, dá uma nota para cada um e escreve uma autópsia baseada em evidências. A única coisa que a pessoa acrescenta é por que realmente parou.",
      detail: {
        tagline: "Uma autópsia para os projetos que ficaram pelo caminho no seu GitHub",
        imageAlt:
          "Página inicial do Deadfolio em português: título dizendo que seu GitHub está cheio de projetos que ficaram pelo caminho e que o Deadfolio encontra eles, com botões para analisar um perfil do GitHub ou colar um repositório.",
        overview:
          "Cole um usuário público do GitHub e o Deadfolio dá uma nota de abandono para cada repositório público. Nos que valem uma olhada, ele roda uma autópsia com IA construída a partir das evidências do próprio repositório. Ninguém precisa informar stack, idade do projeto ou atividade, porque o repositório já sabe. A única pergunta que a pessoa responde é por que realmente parou. O app está disponível em inglês e português.",
        features: [
          "Varredura: um Dead Score de 0 a 100 para cada repositório público, só com metadados. Nenhuma IA roda nessa etapa.",
          "Autópsia: uma geração do Gemini por repositório, validada contra um schema estrito e sempre terminando com uma seção “O que não podemos saber”.",
          "Confirmação: o criador diz se a causa de morte inferida está certa e pode corrigi-la em uma frase.",
          "Cemitério: registros publicados, marcados como NÃO VERIFICADO porque a propriedade do repositório não é verificada.",
        ],
        engineering: [
          "O Dead Score é determinístico e configurável: uma rampa de inatividade, status de arquivado e rajadas curtas seguidas de silêncio. Forks, templates e experimentos ficam separados, e a interface chama a nota de heurística, nunca de probabilidade.",
          "O prompt trata o texto do repositório como dado não confiável e mantém separados evidência, inferência e incógnitas. O modelo não pode inventar usuários, receita ou o motivo real de o desenvolvimento ter parado.",
          "A coleta de evidências ordena os arquivos de forma determinística, nunca busca segredos, lockfiles ou saída de build e remove strings parecidas com chaves antes que qualquer coisa chegue ao modelo.",
          "Os relatórios ficam em cache por repositório e commit da branch padrão, então uma nova visita não faz chamada de IA. Um commit novo gera a oferta de rodar uma nova autópsia.",
          "Os limites contra abuso incluem uma cota diária por IP guardada como hash com salt, uma autópsia simultânea por IP, uma trava global por hora e devolução da cota quando o provedor de IA está sem capacidade.",
          "É um único app Next.js sem banco de dados: uma camada de chave/valor grava no sistema de arquivos localmente e em um Vercel Blob privado em produção.",
        ],
        limits: [
          "Sem contas, pagamentos, notificações ou moderação, de propósito.",
          "Só repositórios públicos são analisados.",
          "A propriedade não é verificada, então todo registro publicado é marcado como NÃO VERIFICADO.",
        ],
      },
    },
    Fintal: {
      status: "No ar",
      description:
        "Um painel de finanças pessoais construído sobre os CSVs exportados pelos bancos, sem login no banco. Importa extratos de Nubank, C6 e Wise, categoriza gastos e acompanha parcelas, assinaturas e orçamentos.",
      detail: {
        tagline: "Finanças pessoais a partir dos extratos do banco, sem senha do banco",
        imageAlt:
          "Tela de insights do Fintal em português: medidor de saúde financeira, gráfico mês a mês de receitas, despesas e saldo com meses de previsão, e progresso do orçamento em relação ao limite mensal.",
        overview:
          "O Fintal é um app de finanças pessoais focado em privacidade. Em vez de pedir credenciais do banco, ele importa os CSVs que os bancos já oferecem, organiza transações, parcelas e assinaturas e transforma tudo em um painel de tendências, orçamentos e diagnósticos.",
        features: [
          "Importação de CSV com detecção automática de formato para Nubank, C6 Bank e Wise (incluindo exportações ZIP multimoeda), e mapeamento de colunas para outros bancos.",
          "Categorização automática, com categorias personalizadas.",
          "Contas e cartões, e uma lista de transações com busca, filtros, edição em massa e rolagem infinita.",
          "Parcelas e assinaturas acompanhadas como gastos recorrentes.",
          "Um painel com nota de saúde financeira, gráficos mês a mês, mapa de calor de intensidade e divisão por categoria.",
          "Modo privacidade que borra todos os valores do app, ativado pelo header ou pela tecla P.",
          "Paleta de comandos (⌘K) e atalhos globais, missões guiadas de onboarding e um PWA instalável.",
        ],
        engineering: [
          "Sem login no banco: os dados entram só por arquivos que o usuário exporta, lidos por detectores específicos de cada banco com mapeamento genérico de colunas como alternativa.",
          "O modo privacidade é um contexto React salvo no localStorage. Ele define um atributo no documento, e um componente PrivacyAmount aplica o desfoque em CSS, para que qualquer valor em qualquer tela possa ser escondido de forma consistente.",
          "A preferência de tema (claro, escuro ou sistema) é aplicada por um script antes da primeira pintura, e o Tailwind roda em modo class para que a escolha do app prevaleça sobre a do sistema operacional.",
          "O frontend em Next.js App Router conversa com uma API em NestJS. O login usa Google OAuth com JWT.",
          "Portões de qualidade: ESLint, Prettier, testes unitários com Vitest e testes end-to-end com Playwright, com o Husky rodando lint, type-check e um build completo antes de cada push.",
        ],
      },
    },
    "Agent-readable portfolio": {
      status: "No ar",
      description:
        "Este site. Um servidor MCP, uma API REST com OpenAPI e llms.txt sobre o mesmo perfil verificado, para que os assistentes de IA dos recrutadores respondam a partir de fatos.",
    },
  } as Record<string, ProjectText>,
  privacy: {
    updated: "29 de setembro de 2026",
    intro:
      "Este é um portfólio pessoal. Não há contas, anúncios ou pagamentos, e nenhum dado é vendido ou compartilhado para marketing.",
    sections: {
      analytics: {
        title: "Analytics",
        body: "O site usa o PostHog para entender como as páginas são usadas: páginas vistas, origem da visita, navegador e tipo de dispositivo, e uma localização aproximada derivada do endereço IP. O PostHog guarda um identificador anônimo em um cookie e no armazenamento local para que visitas repetidas sejam contadas uma vez. Visitantes nunca são identificados por nome ou e-mail.",
      },
      "contact-form": {
        title: "Formulário de contato",
        body: "As mensagens enviadas pelo formulário de contato (nome, e-mail, empresa opcional e mensagem) chegam ao meu e-mail pelo Resend, um provedor de e-mail, e são usadas apenas para responder a você. Elas não ficam guardadas neste site nem entram em nenhuma lista.",
      },
      "browser-storage": {
        title: "Guardado no seu navegador",
        body: "Suas preferências de tema, idioma e animação ficam salvas no armazenamento local e em um cookie de idioma, e uma marcação de sessão impede que a animação de abertura se repita. Nada disso é enviado para lugar nenhum além deste site.",
      },
      hosting: {
        title: "Hospedagem e acesso por máquinas",
        body: "O site é hospedado na Vercel, que mantém logs padrão de requisições (endereço IP, user agent, horário). O país aproximado da requisição é usado apenas para escolher o idioma na primeira visita. Os arquivos llms.txt, as páginas em Markdown e o endpoint MCP servem as mesmas informações públicas do site. Eles são somente leitura e não guardam nada que você envia, incluindo descrições de vaga passadas às ferramentas MCP.",
      },
      contact: {
        title: "Dúvidas",
        body: "Para dúvidas ou para pedir a exclusão dos dados de analytics das suas visitas, envie um e-mail para jordaoqualho@gmail.com.",
      },
    } as Record<string, { title: string; body: string }>,
  },
};
