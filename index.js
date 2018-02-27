import ComponentRepository from './src/Component/ComponentRepository';
import PageViewComponent from './src/Component/PageViewComponent';
import TestGenericWidgetComponent from './src/Component/TestGenericWidgetComponent';

const componentRepository = new ComponentRepository([
    'bootflap'
]);

componentRepository.addComponent('bootflap', 'testy', TestGenericWidgetComponent);

// TODO: move Bootflap to it's own repo, and decide on how to distribute
// right now, best option seems to be 1 repo with both languages, published to
// both packagist and NPM

export { componentRepository, PageViewComponent };
