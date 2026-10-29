// Momentos da batida (s): o "abriel" aparece, o "G" voa da esquerda e bate nele
export const NAME_IN = 0.1;
export const G_START = 0.45;
export const G_FLIGHT = 0.55;
export const IMPACT = G_START + G_FLIGHT;
// O resto do letreiro entra depois da batida
export const AFTER_IMPACT_ORDER = Math.ceil((IMPACT + 0.2 - 0.1) / 0.1);
