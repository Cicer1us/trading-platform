import chaiModule from 'chai';
import { chaiEthers } from 'chai-ethers';
import { Logger } from 'ethers/lib/utils';

// prevent logging from script/utils
Logger.setLogLevel(Logger.levels.WARNING);
chaiModule.use(chaiEthers);

export = chaiModule;
