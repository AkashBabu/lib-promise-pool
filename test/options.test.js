import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import PromisePool from '../src/';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('#options Options', () => {
    it('should exit on first error if stopOnErr is set to true', done => {
        const data = [0.5, 0.75, 1];

        async function worker(d) {
            if (d === 1) {
                throw new Error('Expecting stop');
            }
            return new Promise(res =>
                setTimeout(() => {
                    res(d);
                }, d * 1000),
            );
        }

        PromisePool(data, worker, 2, { stopOnErr: true }).then(() => {}, err => {
            expect(err.message).to.be.eql('Error: Expecting stop');
            done();
        });
    });
    it('should not exit on first error if stopOnErr is set to false', done => {
        const data = [0.5, 0.75, 1];

        async function worker(d) {
            if (d === 1) {
                throw new Error('Expecting stop');
            }
            return new Promise(res =>
                setTimeout(() => {
                    res(d);
                }, d * 1000),
            );
        }

        PromisePool(data, worker, 2, { stopOnErr: false }).then(result => {
            done();
        }, err => {
            done(err);
        });
    });
});
