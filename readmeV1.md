pnpm init
pnpm i express cors dotenv morgan zod

pnpm add -D typescript
npx tsc --init
pnpm add -D @types/node @types/express @types/cors  
pnpm i ts-node-dev tsc-alias
pnpm i tsc
pnpm i tsconfig-paths
pnpm i --save-dev @types/express

// ts-node -r tsconfig-paths/register ./src/index.ts
// nodemon --exec node --loader ts-node/esm src/index.ts

---

solve : pnpm --package=typescript dlx tsc
npm i mongoose
npm i -D @types/mongoose
