# Chrome Sidebar

Extensão gratuita para Google Chrome que adiciona uma **barra lateral flutuante e compacta**, inspirada na praticidade dos atalhos do Opera, sem ocupar a largura do painel lateral nativo do Chrome.

**Versão:** 1.0.0  
**Tecnologia:** JavaScript, HTML/CSS (interface criada via Shadow DOM), Chrome Extensions Manifest V3.  
**Idioma da interface:** português brasileiro.

## Funcionalidades

- **Barra vertical de 48 px**, posicionada à direita e sobreposta ao conteúdo das páginas.
- **Recolhida por padrão:** aparece apenas uma pequena alça (`›`); clique para expandir e use `‹` para recolher novamente.
- **Atalhos iniciais:** WhatsApp Web e Instagram.
- **Reutilização de abas:** ao clicar em um atalho, procura uma aba correspondente já aberta; prioriza a janela atual e abas fixadas. Se não houver correspondência, abre uma nova aba.
- **Atalhos personalizados:** adicione URLs com nome e ícone próprio; é possível editar e excluir atalhos, inclusive os iniciais.
- **Imagens personalizadas:** PNG, JPEG, WebP ou GIF de até 5 MB; imagens são convertidas para PNG redimensionado antes de serem armazenadas.
- **Persistência local:** atalhos ficam salvos em `chrome.storage.local` e aparecem nas páginas onde a extensão pode funcionar.
- **Controle pelo ícone da extensão:** clique no ícone do Chrome Sidebar na barra de ferramentas do Chrome para expandir/recolher na aba atual.
- **Visual escuro**, sem dependências externas nem necessidade de cadastro.

## Instalação manual

1. Baixe o código do repositório (botão **Code → Download ZIP**) e extraia-o.
2. Abra `chrome://extensions` no Chrome.
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta que contém o `manifest.json`.
5. Atualize as abas abertas para que a barra seja exibida.
6. Clique na pequena alça à direita para expandir a barra.

> **Atualizando uma instalação anterior:** para tentar preservar os atalhos, substitua os arquivos na **mesma pasta já carregada** e clique em **Atualizar** em `chrome://extensions`, em vez de remover e reinstalar a extensão. A remoção da extensão pode apagar o armazenamento local. Como o nome foi alterado, o Chrome poderá exibir uma nova solicitação de permissões.

## Como usar

| Controle | Ação |
| --- | --- |
| `›` | Expande a barra recolhida |
| `‹` | Recolhe a barra |
| Ícone do WhatsApp | Ativa a aba existente do WhatsApp Web ou abre uma nova |
| Ícone do Instagram | Ativa a aba existente do Instagram ou abre uma nova |
| `+` inferior | Adiciona um atalho com nome, URL e imagem opcional |
| Engrenagem | Gerencia, edita e exclui atalhos |
| Ícone da extensão no Chrome | Alterna a visibilidade da barra na aba ativa |

### Como os atalhos encontram abas abertas

O WhatsApp e o Instagram reutilizam uma aba do mesmo domínio, independentemente do caminho. Para atalhos personalizados, a extensão compara a **origem e o caminho** da URL. Caso haja mais de uma aba correspondente, a preferência é pela janela atual e por abas fixadas. Não é necessário que a aba esteja fixada para ser reutilizada.

## Permissões

| Permissão | Por que é necessária |
| --- | --- |
| `storage` | Salvar os atalhos personalizados no Chrome |
| `tabs` | Localizar e ativar abas existentes pelos endereços |
| Content script em `http://*/*` e `https://*/*` | Mostrar a barra flutuante nas páginas acessíveis |

A extensão não envia os atalhos para um servidor próprio e não utiliza serviços externos para sincronização. Os links acessados continuam sujeitos às políticas de privacidade dos respectivos sites.

## Limitações conhecidas

- A barra fica **sobre** o site e pode cobrir alguns elementos próximos à borda direita.
- O Chrome não permite injetar extensões em páginas internas como `chrome://`, na Chrome Web Store e em outros endereços restritos.
- A barra não altera a interface nativa de abas do navegador.
- O estado expandido/recolhido não é sincronizado entre páginas: por padrão, a barra começa recolhida.
- Remover a extensão pode apagar os atalhos salvos localmente.

## Estrutura do projeto

```text
chrome-sidebar-v1.0.0/
├── manifest.json    # Metadados, permissões e injeção da extensão
├── background.js    # Busca/ativa abas e alterna a barra pelo ícone da extensão
├── floating.js      # Interface flutuante e gerenciamento dos atalhos
└── README.md        # Documentação do projeto
```

## Desenvolvimento

O projeto utiliza **Manifest V3** e JavaScript puro, sem ferramentas de build. Após editar os arquivos, abra `chrome://extensions`, clique em **Atualizar** e recarregue as páginas para testar as mudanças.

## Status

**v1.0.0 — primeira versão estável para uso pessoal.** Esta versão consolida o funcionamento testado pelo usuário na linha 0.5.x do projeto Chrome Plus.
