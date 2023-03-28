import dapp from './dapp';


let copying = false;


const register = () => {
    console.log('Creating dash platform identity, registering dapp manifest contract in browser, creating random dapp manifest document');

    dapp.manifest.setup('Fhyg6zS8K9GxnA1pUjQu6BDTV5zoJZbbQRzzjbrP1iB', 'HKbczVKJD8wodxwStdbhgJJ3BtDwqrJtVEGcRQ46WbRC', 'entry brass luxury beauty meadow amazing teach company transfer struggle blade high', async (config) => {
        console.log('Creating dapp manifest document');

        let doc = await dapp.manifest.save([
            {
                author: 'ICJR',
                description: 'Proof of concept dapp manifest',
                ipfs: 'https://cloudflare-ipfs.com/ipfs/QmcnPnYGraPfR4BZdRQqmFS78uoWoagnURqZkedxZ5T67s/',
                // metadata: {
                //     info: 'Data exists for developers to include any additional information about their dapp'
                // },
                name: 'linktree',
                repository: 'https://github.com/dash-incubator/linktree-ipfs',
                version: 'proof of concept'
            }
        ]);

        console.log(doc);
        console.log(`Returned document can be queried to load dapp information. If you wish to interact with the dapp load the link saved in the 'ipfs' key`);

        // Unlock mnemonic field
        let button = document.getElementById('mnemonic-button'),
            form = document.getElementById('mnemonic-form'),
            input = document.getElementById('mnemonic-input');

        form.style.display = 'block';
        button.addEventListener('click', async () => {
            if (copying) {
                return;
            }

            console.log('Starting to copy the original dapp document into your document store using the mnemonic you provided');

            let mnemonic = input.value.split(' ');

            if (mnemonic.length === 12) {
                let d = {},
                    data = doc.transitions[0];

                for (let key in data) {
                    if (key.startsWith('$')) {
                        continue;
                    }

                    d[key] = data[key];
                }

                copying = true;

                console.log(
                    await dapp.manifest.copy(null, d, null, mnemonic.join(' '))
                );
            }
            else {
                console.log('Provide a valid mnemonic');
            }
        })
    });
};


if (['complete', 'interactive', 'loaded'].includes(document.readyState)) {
    register();
}
else {
    document.addEventListener('DOMContentLoaded', register);
}
