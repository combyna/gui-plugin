import ComponentRepository from './src/Component/ComponentRepository';
import ButtonComponent from './src/Component/ButtonComponent'

const componentRepository = new ComponentRepository([
    'gui'
]);

componentRepository.addComponent('gui', 'button', ButtonComponent);
