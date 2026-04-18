// Fórmula de Haversine — calcula a distância entre dois pontos na superfície
// da Terra levando em conta que ela é esférica, não plana.
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio médio da Terra em km

  // Converte graus para radianos — a fórmula exige radianos
  const paraRad = (grau) => (grau * Math.PI) / 180;

  const dLat = paraRad(lat2 - lat1);
  const dLon = paraRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(paraRad(lat1)) *
    Math.cos(paraRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Resultado em km
};

exports.calcularDistancia = (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.query;

  // Valida se todos os parâmetros foram enviados
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return res.status(400).json({
      erro: 'Informe os quatro parâmetros: lat1, lon1, lat2, lon2',
    });
  }

  // Converte para número e valida se são números válidos
  const coords = [lat1, lon1, lat2, lon2].map(Number);
  if (coords.some(isNaN)) {
    return res.status(400).json({
      erro: 'Todos os parâmetros devem ser números válidos',
    });
  }

  const [lt1, ln1, lt2, ln2] = coords;

  // Valida os intervalos válidos de latitude e longitude
  if (lt1 < -90 || lt1 > 90 || lt2 < -90 || lt2 > 90) {
    return res.status(400).json({ erro: 'Latitude deve estar entre -90 e 90' });
  }
  if (ln1 < -180 || ln1 > 180 || ln2 < -180 || ln2 > 180) {
    return res.status(400).json({ erro: 'Longitude deve estar entre -180 e 180' });
  }

  const distanciaKm = haversine(lt1, ln1, lt2, ln2);

  res.json({
    pontoA: { latitude: lt1, longitude: ln1 },
    pontoB: { latitude: lt2, longitude: ln2 },
    distancia: {
      km: parseFloat(distanciaKm.toFixed(2)),
      metros: parseFloat((distanciaKm * 1000).toFixed(0)),
    },
  });
};