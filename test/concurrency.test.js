import { expect } from 'chai';
import PromisePool from '../src/index';

async function worker(d) {
    return new Promise(res => setTimeout(() => res(d), d * 1000));
}
describe('#concurrency PromisePool', () => {
    it('should execute the job sequentially if the concurrency number is 1', async () => {
        const data = [0.5, 0.5, 0.5];

        const start = Date.now();
        await PromisePool(data, worker, 1);
        const end = Date.now();

        const expectedTime = data.reduce((s, i) => s + i, 0) * 1000;
        expect(end - start).to.be.greaterThan(expectedTime - 1);
        expect(end - start).to.be.lessThan(expectedTime + 100);
    });

    it('should return corresponding data in the returned array of results even with concurrency greater than 1', async () => {
        const data = [0.5, 1, 0.75, 0.25];

        const result = await PromisePool(data, worker, 2);
        data.forEach((d, i) => {
            expect(d).to.be.eql(result[i]);
        });
    });
});
