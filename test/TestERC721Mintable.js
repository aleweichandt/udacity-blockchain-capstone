var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const tkn_id_one = 1;
    const tkn_id_two = 2;
    const tkn_id_three = 3;

    describe('match erc721 spec', async function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new("test tkns", "TEST", {from: account_one});

            await this.contract.mint(account_two, tkn_id_one, {from: account_one});
            await this.contract.mint(account_two, tkn_id_two, {from: account_one});
            // TODO: mint multiple tokens
        });

        it('should return total supply', async function () { 
            const total = await this.contract.totalSupply.call();
            assert.equal(total, 2, "Invalid total supply");
        });

        it('should get token balance', async function () { 
            const balance = await this.contract.balanceOf.call(account_two);
            assert.equal(balance, 2, "Invalid balance for account");
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const expected = `https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/${tkn_id_one}`;
            const uri = await this.contract.tokenURI.call(tkn_id_one);
            assert.equal(uri, expected, "Invalid uri for token");
        });

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_two, account_one, tkn_id_two, {from: account_two});
            const owner = await this.contract.ownerOf.call(tkn_id_two);
            assert.equal(owner, account_one, "Invalid transfer");
        });
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new("test tkns", "TEST", {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let exception = null;
            try {
                await this.contract.mint(account_two, tkn_id_three, {from: account_two});
            } catch(e) {
                exception = e;
            }
            assert.notEqual(exception, null, "tokens cannot be created by different users than owner");
        })

        it('should return contract owner', async function () { 
            const owner = await this.contract.getOwner.call();
            assert.equal(owner, account_one, "Invalid contract owner");
        })

    });
})