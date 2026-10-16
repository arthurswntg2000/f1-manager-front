// Criado (16/10/2026)

export function registrarAtividade(tipo, descricao) {
  const atividades = JSON.parse(localStorage.getItem('f1_atividades') || '[]')

  const novaAtividade = {
    id: Date.now() + Math.random(),
    tipo,
    descricao,
    timestamp: Date.now()
  }

  atividades.unshift(novaAtividade)
  
  // Mantém apenas os 10 registros mais recentes
  if (atividades.length > 10) atividades.pop()

  localStorage.setItem('f1_atividades', JSON.stringify(atividades))
}

export function buscarAtividades() {
  const atividades = JSON.parse(localStorage.getItem('f1_atividades') || '[]')
  return atividades.map(atv => ({
    ...atv,
    tempoRelativo: formatarTempoRelativo(atv.timestamp)
  }))
}

export function formatarTempoRelativo(timestamp) {
  if (!timestamp) return 'Agora mesmo'

  const agora = Date.now()
  const diferencaSegundos = Math.floor((agora - timestamp) / 1000)

  if (diferencaSegundos < 30) return 'Agora mesmo'
  if (diferencaSegundos < 60) return `Há ${diferencaSegundos} seg`

  const minutos = Math.floor(diferencaSegundos / 60)
  if (minutos < 60) return `Há ${minutos} min`

  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `Há ${horas} h${horas > 1 ? 's' : ''}`

  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'Ontem'
  if (dias < 7) return `Há ${dias} dias`

  // Para datas mais antigas, exibe data e hora reais
  const data = new Date(timestamp)
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  const hora = String(data.getHours()).padStart(2, '0')
  const min = String(data.getMinutes()).padStart(2, '0')

  return `${dia}/${mes}/${ano} às ${hora}:${min}`
}