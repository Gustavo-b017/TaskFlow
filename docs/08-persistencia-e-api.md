# 💾 Persistência e APIs Externas

O **TaskFlow** precisa garantir que o usuário não perca seus dados ao fechar o app e também consiga buscar informações externas para enriquecer sua experiência.

## 📱 Armazenamento Local (AsyncStorage)

Nesta prova, o `AsyncStorage` é fundamental para salvar:
1.  **Sessão do Usuário:** Para manter o login ativo.
2.  **Tarefas:** Todas as operações do CRUD (Criar, Editar, Excluir) devem ser refletidas no armazenamento local.
3.  **Preferências:** O tema escolhido (Dark/Light).

### Como funciona?
O `AsyncStorage` salva os dados como strings JSON no dispositivo. Sempre que o app inicia, ele busca esses dados e os carrega nos contextos (`AuthContext` e `TaskContext`).

---

## 🌐 Consumo de API Externa

O app consome uma API para buscar dados complementares. Conforme sugerido na prova, usamos APIs públicas (como **JSONPlaceholder** ou **DummyJSON**) para:

1.  **Frase Motivacional:** Exibida na tela Home.
2.  **Categorias:** Buscar nomes de categorias para adicionar às tarefas.
3.  **Imagens:** Representar ícones das categorias.

### O que o app deve demonstrar?
-   **Fetch ou Axios:** Uso de uma biblioteca para fazer a chamada HTTP.
-   **Tratamento de Loading:** Mostrar um indicador (`ActivityIndicator`) enquanto os dados não chegam.
-   **Tratamento de Erro:** Exibir uma mensagem caso o servidor esteja fora do ar ou não haja internet.
-   **Atualização da Interface:** Refletir os dados da API na tela automaticamente (ex: frase do dia mudando no useEffect).

---

## 🛠️ Regras de Negócio (Check-list Final)
1. Título é obrigatório.
2. Não permitir salvar campos vazios.
3. Cada tarefa deve ter um ID único.
4. Datas de criação/atualização devem ser geradas automaticamente.
5. Edição deve preservar o ID original.
6. Exclusão exige confirmação visual.
7. Persistência local deve ser re-hidratada no boot do app.

---
## 🎉 Conclusão do Guia

Parabéns por seguir este guia educacional! Ao completar este projeto, você terá construído um app profissional que cobre todos os fundamentos do **React Native**.

Bom trabalho no projeto e boa sorte na entrega!
