export const possuiFuncaoAcesso = (funcoes: string[], funcoesCurrent: string[]) : boolean => {
    return funcoesCurrent.filter(r => funcoes.includes(r)).length > 0;
  }