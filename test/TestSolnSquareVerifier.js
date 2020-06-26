const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const truffleAssert = require('truffle-assertions');

const proofData = require('./proof.json');

contract('SolnSquareVerifier', accounts => {
    const owner = accounts[0];

    const tkn1 = { id: 1, holder: accounts[1] };
    const tkn2 = { id: 2, holder: accounts[2] };
    const { proof: { a, b, c }, valid } = proofData;

    describe('SquareVerifier test', () => {
        beforeEach(async () => {
            const verifier = await SquareVerifier.new({from: owner});
            this.contract = await SolnSquareVerifier.new(verifier.address, "test tkns", "TEST", {from: owner});
        });

        it('should add new solution', async () => {
            const { holder, id } = tkn1;
            const transaction = await this.contract.mintToken(holder, id, a, b, c, valid, {from: owner});
            
            truffleAssert.eventEmitted(transaction, "SolutionAdded", (ev) => {
                return (ev.to == holder && ev.tokenId == id);
            });
            const tknHolder = await this.contract.ownerOf.call(id);
            assert.equal(tknHolder, holder, "Invalid token owner");
        });

        it('should not reuse same solution', async () => {
            const { holder: holder1, id: id1 } = tkn1;
            const { holder: holder2, id: id2 } = tkn1;
            await this.contract.mintToken(holder1, id1, a, b, c, valid, {from: owner});

            let exception = null;
            try{
                await this.contract.mintToken(holder2, id2, a, b, c, valid, {from: owner});
            } catch(e) {
                exception = e;
            }
            assert.notEqual(exception, null, "should not allow to reuse existing solution twice");
        })
    });
});
