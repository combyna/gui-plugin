/**
 * Combyna base GUI plugin
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/gui-plugin
 *
 * Released under the MIT license
 * https://github.com/combyna/gui-plugin/raw/master/MIT-LICENSE.txt
 */

import createElementFactory from './js/src/React/Component/createElementFactory'
import ReactElementFactoryRepository from './js/src/React/Component/ReactElementFactoryRepository';
import PageViewComponent from './js/src/React/Component/PageViewComponent';
import TriggerMappingRepository from "./js/src/React/Component/TriggerMappingRepository";

const builtinTriggerMappingRepository = new TriggerMappingRepository();
const reactElementFactoryRepository = new ReactElementFactoryRepository(builtinTriggerMappingRepository);

builtinTriggerMappingRepository.addMapping('native_dom', 'gui', 'click', (dispatchEvent) => {
    return {
        onClick () {
            dispatchEvent('gui', 'click');
        }
    };
});

export { createElementFactory, reactElementFactoryRepository, builtinTriggerMappingRepository, PageViewComponent };
