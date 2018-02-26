import ComponentRepository from './src/Component/ComponentRepository';
import ButtonComponent from './src/Component/ButtonComponent';
import PageViewComponent from './src/Component/PageViewComponent';
import TextBoxComponent from './src/Component/TextBoxComponent'
import BoxComponent from './src/Component/BoxComponent'

const componentRepository = new ComponentRepository([
    'gui'
]);

componentRepository.addComponent('gui', 'button', ButtonComponent);
componentRepository.addComponent('gui', 'textbox', TextBoxComponent);
componentRepository.addComponent('gui', 'box', BoxComponent);

export { componentRepository, PageViewComponent };
