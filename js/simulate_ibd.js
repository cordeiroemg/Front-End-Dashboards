function simulateIBD(pedigree, numLoci = 10000) {
  const genotypes = {};

  function makeFounderAlleles(label) {
    const maternal = Array.from({ length: numLoci }, (_, i) => `${label}_M_${i}`);
    const paternal = Array.from({ length: numLoci }, (_, i) => `${label}_P_${i}`);
    return [maternal, paternal];
  }

  for (const ind in pedigree) {
    if (pedigree[ind].parents === null) {
      genotypes[ind] = makeFounderAlleles(ind);
    }
  }

  for (const ind in pedigree) {
    const parents = pedigree[ind].parents;
    if (parents !== null) {
      const [p1, p2] = parents;
      const allelesP1 = genotypes[p1];
      const allelesP2 = genotypes[p2];
      const inherited1 = Array.from({ length: numLoci }, (_, i) =>
        Math.random() < 0.5 ? allelesP1[0][i] : allelesP1[1][i]
      );
      const inherited2 = Array.from({ length: numLoci }, (_, i) =>
        Math.random() < 0.5 ? allelesP2[0][i] : allelesP2[1][i]
      );
      genotypes[ind] = [inherited1, inherited2];
    }
  }

  const fValues = {};
  for (const ind in genotypes) {
    const [a1, a2] = genotypes[ind];
    let matches = 0;
    for (let i = 0; i < numLoci; i++) {
      if (a1[i] === a2[i]) matches++;
    }
    fValues[ind] = matches / numLoci;
  }

  const fIJ = {};
  const rIJ = {};
  const ids = Object.keys(genotypes);

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const I = ids[i], J = ids[j];
      const allelesI = genotypes[I];
      const allelesJ = genotypes[J];
      let countIBD = 0;
      for (let k = 0; k < numLoci; k++) {
        const ai = Math.random() < 0.5 ? allelesI[0][k] : allelesI[1][k];
        const aj = Math.random() < 0.5 ? allelesJ[0][k] : allelesJ[1][k];
        if (ai === aj) countIBD++;
      }
      const f_ij = countIBD / numLoci;
      fIJ[`${I},${J}`] = f_ij;
      const denom = Math.sqrt((1 + fValues[I]) * (1 + fValues[J]));
      rIJ[`${I},${J}`] = (2 * f_ij) / denom;
    }
  }

  return { fValues, fIJ, rIJ };
}
