const v = {};

const k1 = {toString: () => 'strange'};
const k2 = {toString: () => 'void'};

v[k1] = 3;
v[k2] = 4;

console.log(v);