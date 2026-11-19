import { searchIndex } from '../lib/search';
export const GET = async () => new Response(JSON.stringify(await searchIndex('es')), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
