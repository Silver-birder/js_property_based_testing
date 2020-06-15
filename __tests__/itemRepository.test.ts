import fc from 'fast-check';
import {DbServer} from "../src/dbServer";
import {DbClient} from "../src/dbClient";
import {ItemRepository} from "../src/itemRepository";

let server: any, client: any;

beforeEach(async () => {
    server = new DbServer();
    await server.start();
    const uri: string = await server.server.getUri();
    client = new DbClient();
    await client.start(uri);
});
afterEach(async () => {
    await server.stop();
    await client.stop();
});

describe('itemRepository', () => {
    test('', async () => {
        await fc.assert(
            fc.asyncProperty(fc.array(fc.integer(100, 1000)), async (ns) => {
                let data = ns.map((n) => {
                    return {name: "sample", price: n}
                });
                const itemRepository = new ItemRepository(client.client);
                await itemRepository.insertItems(data);
                const result = await itemRepository.findItemByPriceGreaterThan(100);
                expect(data.length).toBe(result.length);

                await client.drop();
            })
        );
    });
});