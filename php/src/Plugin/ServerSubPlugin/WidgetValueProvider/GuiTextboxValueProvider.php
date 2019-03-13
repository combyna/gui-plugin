<?php

/**
 * Combyna Symfony bundle
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/combyna-bundle
 *
 * Released under the MIT license
 * https://github.com/combyna/combyna-bundle/raw/master/MIT-LICENSE.txt
 */

namespace Combyna\Plugin\Gui\Plugin\ServerSubPlugin\WidgetValueProvider;

use Combyna\Component\Environment\Library\WidgetValueProviderLocator;
use Combyna\Component\Environment\Library\WidgetValueProviderProviderInterface;

/**
 * Class GuiTextboxValueProvider
 *
 * @author Dan Phillimore <dan@ovms.co>
 */
class GuiTextboxValueProvider implements WidgetValueProviderProviderInterface
{
    /**
     * {@inheritdoc}
     */
    public function getWidgetValueProviderLocators()
    {
        return [
            new WidgetValueProviderLocator('gui', 'textbox', 'text', function (array $path) {
                // TODO: Stub - fetch the value of this field from the POST data.
                //       To be host framework agnostic (eg. when the host app uses Symfony or Laravel),
                //       we should add a delegating RequestProvider service to the core Combyna lib,
                //       and then add a service in CombynaBundle tagged so that it is set on the delegator.
                //       We can then use the delegator from this value provider to get the Request object
                //       that we can extract the value from.
                return '';
            })
        ];
    }
}
