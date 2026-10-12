export const calculateDamage = ({ hp, number, shield }) => {
  if (shield === 0) {
    return hp - number;
  } else if (shield < number) {
    return hp - (number - shield);
  }
  return hp;
};

export const calculateShieldRank = ({ shield, shieldRank, number, breakableShield }) => {
  if (shield > 0 && shieldRank === 0) {
    return breakableShield ? [shield, number] : [shield, 0];
  } else if (shieldRank >= number) {
    return [shield, number];
  }
  return [0, 0];
};

export const attackEnemy = (state, { number }) => {
  const hp = calculateDamage({ hp: state.hp, number, shield: state.shield });

  if (hp <= 0) {
    return {
      ...state,
      hp,
      shield: 0,
      shieldRank: 0,
      gameState: 'Game over',
      gameScene: 'endGame',
    };
  }

  const [shield, shieldRank] = calculateShieldRank({
    shield: state.shield,
    shieldRank: state.shieldRank,
    number,
    breakableShield: state.breakableShield,
  });
  return { ...state, hp, shield, shieldRank, xp: state.xp + number, gameState: '' };
};
