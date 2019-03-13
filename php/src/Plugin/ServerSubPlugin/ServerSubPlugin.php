<?php

/**
 * Combyna
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/combyna
 *
 * Released under the MIT license
 * https://github.com/combyna/combyna/raw/master/MIT-LICENSE.txt
 */

namespace Combyna\Plugin\Gui\Plugin\ServerSubPlugin;

use Combyna\Component\Framework\Originators;
use Combyna\Component\Plugin\AbstractSubPlugin;

/**
 * Class ServerSubPlugin
 *
 * @author Dan Phillimore <dan@ovms.co>
 */
class ServerSubPlugin extends AbstractSubPlugin
{
    /**
     * {@inheritdoc}
     */
    public function getSupportedOriginators()
    {
        // Only install this plugin server-side,
        // as client-side we register providers etc. from JS-land
        return [Originators::SERVER];
    }
}
