"nodemon --exec node tsconfig-paths/register ts-node --esm src/index.ts"

nodemon --exec node -r ts-node/register --loader ts-node/esm src/index.ts

tsc && tsc-alias
