import dapp from 'dapp';


const { document, contract } = dapp;
const storage = dapp.storage.localStorage;


let apps = () => {
        return {
            dapp: {
                contractId: storage.get('contract')
            }
        };
    },
    definitions = {
        manifest: {
            additionalProperties: false,
            indices: [
                { properties: [{ $ownerId: 'asc' }], unique: false }
            ],
            properties: {
                author: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                ipfs: {
                    type: 'string'
                },
                // metadata: {
                //     type: 'object'
                // },
                name: {
                    type: 'string'
                },
                repository: {
                    type: 'string'
                },
                version: {
                    type: 'string'
                }
            },
            required: ['author', 'description', 'ipfs', 'name', 'repository', 'version']
        }
    },
    locators = {
        manifest: 'dapp.manifest'
    };


const methods = {
    copy: async (contract, doc, identity, mnemonic) => {
        let config = await dapp.storage.setup(contract, definitions, identity, mnemonic),
            response = await document.save(apps(), [doc], config.identity, locators.manifest, config.mnemonic);

        return { config, documents: response };
    },
    delete: async (documents) => {
        return await document.delete(storage.get('contract'), documents, storage.get('identity'), storage.get('mnemonic'));
    },
    read: async (identityId) => {
        let query = {};

        if (identityId) {
            query['where'] = [
                ['$ownerId', Array.isArray(identityId) ? 'in' : '==', identityId]
            ];
        }

        return await document.read(apps(), locators.manifest, query);
    },
    save: async (documents) => {
        return await document.save(apps(), documents, storage.get('identity'), locators.manifest, storage.get('mnemonic'));
    },
    setup: async (contract, identity, mnemonic, fn) => {
        let config = { contract, identity, mnemonic };

        if (config.mnemonic) {
            config = await storage.set(config.contract, definitions, config.identity, config.mnemonic);
        }

        if (!config.contract || !config.identity) {
            setTimeout(() => {
                setup(config.contract, config.identity, config.mnemonic, fn);
            }, (60 * 1000));
        }
        else {
            if (fn) {
                fn(config);
            }
        }
    }
};


export default methods;
