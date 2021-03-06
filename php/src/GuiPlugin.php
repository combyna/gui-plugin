<?php

/**
 * Combyna
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/combyna
 *
 * Released under the MIT license
 * https://github.com/combyna/combyna/raw/master/MIT-LICENSE.txt
 */

namespace Combyna\Plugin\Gui;

use Combyna\Component\Plugin\AbstractPlugin;
use Combyna\Plugin\Gui\Plugin\ServerSubPlugin\ServerSubPlugin;

/**
 * Class GuiPlugin
 *
 * @author Dan Phillimore <dan@ovms.co>
 */
class GuiPlugin extends AbstractPlugin
{
    const GUI_LIBRARY = 'gui';

    /**
     * {@inheritdoc}
     */
    public function getSubPlugins()
    {
        return [
            new ServerSubPlugin()
        ];
    }
}
