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
import TriggerMappingRepository from './js/src/React/Component/TriggerMappingRepository';
import WidgetValueProviderRepository from './js/src/React/Component/WidgetValueProviderRepository';

const builtinTriggerMappingRepository = new TriggerMappingRepository();
const reactElementFactoryRepository = new ReactElementFactoryRepository(builtinTriggerMappingRepository);
const valueProviderRepository = new WidgetValueProviderRepository();

builtinTriggerMappingRepository.addMapping('native_dom', 'gui', 'click', (dispatchEvent) => {
    return {
        onClick () {
            dispatchEvent('gui', 'click');
        }
    };
});

valueProviderRepository.addProvider('gui', 'textbox', 'text', (element) => {
    return element.value; // Just fetch the value of the textbox from its native DOM node
});

export {
    createElementFactory,
    reactElementFactoryRepository,
    builtinTriggerMappingRepository,
    PageViewComponent,
    valueProviderRepository
};
