<?php

/**
 * Combyna
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/combyna
 *
 * Released under the MIT license
 * https://github.com/combyna/combyna/raw/master/MIT-LICENSE.txt
 */

namespace Combyna\Plugin\Gui\Test\Integrated;

use Combyna\Component\App\AppInterface;
use Combyna\Component\Environment\Config\Act\EnvironmentNode;
use Combyna\Component\Framework\Combyna;
use Combyna\Component\Renderer\Html\HtmlRenderer;
use Combyna\Plugin\Gui\Test\Harness\TestCase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class PrimitiveWidgetDefinitionsIntegratedTest
 *
 * Checks the gui.* primitive widget definitions for correct behaviour
 *
 * @author Dan Phillimore <dan@ovms.co>
 */
class PrimitiveWidgetDefinitionsIntegratedTest extends TestCase
{
    /**
     * @var AppInterface
     */
    private $app;

    /**
     * @var Combyna
     */
    private $combyna;

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @var EnvironmentNode
     */
    private $environment;

    /**
     * @var HtmlRenderer
     */
    private $htmlRenderer;

    public function setUp()
    {
        global $combynaBootstrap;
        $this->container = $combynaBootstrap->createContainer();

        $this->combyna = $this->container->get('combyna');
        $this->htmlRenderer = $this->container->get('combyna.renderer.html');

        $appConfig = [
            'name' => 'My test Combyna app',
            'home' => [
                'route' => 'app.my_home_route'
            ],
            'routes' => [
                'my_home_route' => [
                    'pattern' => '',
                    'page_view' => 'my_view'
                ]
            ],
            'page_views' => [
                'my_view' => [
                    'title' => [
                        'type' => 'text',
                        'text' => 'My view'
                    ],
                    'description' => 'A test view, for testing',
                    'widget' => [
                        'type' => 'group',
                        'children' => [
                            [
                                // Demonstrate the box GUI widget
                                'type' => 'gui.box',
                                'children' => [
                                    'contents' => [
                                        'type' => 'text',
                                        'text' => [
                                            'type' => 'text',
                                            'text' => 'Some text in here'
                                        ]
                                    ]
                                ]
                            ],
                            [
                                // Demonstrate the button GUI widget
                                'type' => 'gui.button',
                                'attributes' => [
                                    'label' => [
                                        'type' => 'text',
                                        'text' => 'Click me'
                                    ]
                                ]
                            ],
                            [
                                // Demonstrate the horizontal rule GUI widget
                                'type' => 'gui.horizontal_rule'
                            ],
                            [
                                // Demonstrate the textbox GUI widget
                                'type' => 'gui.textbox',
                                'attributes' => [
                                    'value' => [
                                        'type' => 'text',
                                        'text' => 'Some text in the box'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $this->environment = $this->combyna->createEnvironment();
        $this->app = $this->combyna->createApp($appConfig, $this->environment);
    }

    public function testRenderAppReturnsTheCorrectHtmlOnInitialLoad()
    {
        $appState = $this->app->createInitialState();

        $expectedHtml = <<<HTML
<div class="combyna-view" data-view-name="my_view">
    <div>Some text in here</div><button name="combyna-widget-my_view-root-1">Click me</button><hr><input name="combyna-widget-my_view-root-3" type="text" value="Some text in the box">
</div>
HTML;
        static::assertSame($expectedHtml, $this->htmlRenderer->renderApp($appState));
    }
}
