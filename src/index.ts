import { promises } from 'node:dns';
import { Elysia } from 'elysia';

// Fuck Typescript why does the Resolver type misses a function
type DnsResolver = promises.Resolver & {
  setServers: (servers: string[]) => void;
};

const DNS_SERVER = process.env.DNS_SERVER || '8.8.8.8';
const PORT = process.env.PORT || '80';

const resolver = new promises.Resolver() as DnsResolver;
resolver.setServers([DNS_SERVER]);

const server = new Elysia();

server.get('/a/:hostname', async ({ query, params: { hostname } }) => {
  const returnOnlyFirst = query.first === 'true';
  const records = await resolver.resolve(hostname);
  if (returnOnlyFirst) {
    return records.slice(0);
  } else {
    return records;
  }
});

server.get('/cname/:hostname', async ({ query, params: { hostname } }) => {
  const returnOnlyFirst = query.first === 'true';
  const records = await resolver.resolveCname(hostname);
  if (returnOnlyFirst) {
    return records.slice(0);
  } else {
    return records;
  }
});

server.get('/mx/:hostname', async ({ query, params: { hostname } }) => {
  const returnOnlyFirst = query.first === 'true';
  const records = await resolver.resolveMx(hostname);
  if (returnOnlyFirst) {
    return records.slice(0);
  } else {
    return records;
  }
});

server.get('/ns/:hostname', async ({ query, params: { hostname } }) => {
  const returnOnlyFirst = query.first === 'true';
  const records = await resolver.resolveNs(hostname);
  if (returnOnlyFirst) {
    return records.slice(0);
  } else {
    return records;
  }
});

server.listen(PORT);

console.log(`dns-api running on ${PORT} resolving using ${DNS_SERVER}`);
